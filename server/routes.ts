import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertUserSchema, insertMenuItemSchema, updateMenuItemSchema, insertGalleryImageSchema } from "@shared/schema";
import { requireAuth, rateLimitLogin, resetRateLimit } from "./middleware/auth";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configure multer for image uploads
const uploadDir = path.join(__dirname, "../client/public/uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const upload = multer({
  storage: multer.diskStorage({
    destination: uploadDir,
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      cb(null, uniqueSuffix + path.extname(file.originalname));
    }
  }),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    if (extname && mimetype) {
      cb(null, true);
    } else {
      cb(new Error("Only images are allowed"));
    }
  }
});

async function seedAdminUser() {
  try {
    const existingUser = await storage.getUserByUsername("admin");
    if (!existingUser) {
      // Use environment variable for admin password
      const adminPassword = process.env.ADMIN_PASSWORD;
      
      if (!adminPassword) {
        console.error("❌ ADMIN_PASSWORD environment variable is not set!");
        console.error("⚠️  Please set ADMIN_PASSWORD before starting the server.");
        throw new Error("ADMIN_PASSWORD environment variable is required");
      }
      
      await storage.createUser({
        username: "admin",
        password: adminPassword
      });
      console.log("✅ Admin korisnik kreiran: username=admin");
      console.log("⚠️  Lozinka učitana iz ADMIN_PASSWORD environment varijable");
    } else {
      console.log("✅ Admin korisnik već postoji");
    }
  } catch (error) {
    console.error("❌ Greška pri kreiranju admin korisnika:", error);
    throw error;
  }
}

export async function registerRoutes(app: Express): Promise<{ server: Server; seedAdminUser: () => Promise<void> }> {
  // Login endpoint with rate limiting
  app.post("/api/auth/login", rateLimitLogin, async (req, res) => {
    try {
      const { username, password } = req.body;

      if (!username || !password) {
        return res.status(400).json({ 
          success: false, 
          message: "Korisničko ime i lozinka su obavezni" 
        });
      }

      const user = await storage.getUserByUsername(username);

      if (!user) {
        return res.status(401).json({ 
          success: false, 
          message: "Pogrešno korisničko ime ili lozinka" 
        });
      }

      const isValidPassword = await storage.verifyPassword(password, user.password);
      if (!isValidPassword) {
        return res.status(401).json({ 
          success: false, 
          message: "Pogrešno korisničko ime ili lozinka" 
        });
      }

      // Create session
      req.session.userId = user.id;
      req.session.username = user.username;
      
      // Reset rate limit on successful login
      const ip = req.ip || req.socket.remoteAddress || 'unknown';
      resetRateLimit(ip);

      // Explicitly save session before sending response
      req.session.save((err) => {
        if (err) {
          console.error("Session save error:", err);
          return res.status(500).json({ 
            success: false, 
            message: "Greška pri čuvanju sesije" 
          });
        }
        
        res.json({ 
          success: true, 
          message: "Uspešno ste se prijavili!",
          user: {
            id: user.id,
            username: user.username
          }
        });
      });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ 
        success: false, 
        message: "Greška na serveru" 
      });
    }
  });

  // Logout endpoint
  app.post("/api/auth/logout", (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ 
          success: false, 
          message: "Greška pri odjavljivanju" 
        });
      }
      res.json({ 
        success: true, 
        message: "Uspešno ste se odjavili" 
      });
    });
  });

  // Check session endpoint
  app.get("/api/auth/session", (req, res) => {
    if (req.session && req.session.userId) {
      return res.json({ 
        success: true, 
        user: {
          id: req.session.userId,
          username: req.session.username
        }
      });
    }
    res.status(401).json({ 
      success: false, 
      message: "Niste prijavljeni" 
    });
  });

  // User Management Endpoints (Admin only)
  
  // Get all users (without passwords)
  app.get("/api/users", requireAuth, async (req, res) => {
    try {
      const users = await storage.getAllUsers();
      // Remove password from response for security
      const safeUsers = users.map(({ password, ...user }) => user);
      res.json({ 
        success: true, 
        users: safeUsers 
      });
    } catch (error) {
      console.error("Get users error:", error);
      res.status(500).json({ 
        success: false, 
        message: "Greška pri učitavanju korisnika" 
      });
    }
  });

  // Create new admin user
  app.post("/api/users", requireAuth, async (req, res) => {
    try {
      const validatedData = insertUserSchema.parse(req.body);
      
      // Check if username already exists
      const existingUser = await storage.getUserByUsername(validatedData.username);
      if (existingUser) {
        return res.status(400).json({ 
          success: false, 
          message: "Korisničko ime već postoji" 
        });
      }

      const newUser = await storage.createUser(validatedData);
      
      // Remove password from response
      const { password, ...safeUser } = newUser;
      
      res.json({ 
        success: true, 
        message: "Admin korisnik uspešno kreiran",
        user: safeUser
      });
    } catch (error: any) {
      console.error("Create user error:", error);
      
      // Handle Zod validation errors separately
      if (error.name === "ZodError") {
        return res.status(400).json({ 
          success: false, 
          message: "Nevažeći podaci za korisnika",
          errors: error.errors 
        });
      }
      
      // Unexpected server errors
      res.status(500).json({ 
        success: false, 
        message: "Greška pri kreiranju korisnika" 
      });
    }
  });

  // Get ordering status
  app.get("/api/settings/ordering-enabled", async (req, res) => {
    try {
      const value = await storage.getSetting("ordering_enabled");
      res.json({ 
        success: true, 
        orderingEnabled: value === "true"
      });
    } catch (error) {
      res.json({ success: true, orderingEnabled: true });
    }
  });

  // Update ordering status (admin only)
  app.post("/api/settings/ordering-enabled", requireAuth, async (req, res) => {
    try {
      const { enabled } = req.body;
      await storage.setSetting("ordering_enabled", enabled ? "true" : "false");
      res.json({ 
        success: true, 
        message: "Postavka ažurirana",
        orderingEnabled: enabled
      });
    } catch (error) {
      res.status(500).json({ 
        success: false, 
        message: "Greška pri ažuriranju" 
      });
    }
  });

  // Protected admin dashboard route
  app.get("/admin/dashboard", requireAuth, (req, res, next) => {
    // This will be handled by Vite in development or static files in production
    next();
  });

  // Menu Items API Endpoints
  
  // Get all menu items
  app.get("/api/menu-items", async (req, res) => {
    try {
      const items = await storage.getAllMenuItems();
      res.json({ success: true, items });
    } catch (error) {
      console.error("Error fetching menu items:", error);
      res.status(500).json({ success: false, message: "Greška pri učitavanju stavki" });
    }
  });

  // Get featured menu items
  app.get("/api/menu-items/featured", async (req, res) => {
    try {
      const items = await storage.getFeaturedMenuItems();
      res.json({ success: true, items });
    } catch (error) {
      console.error("Error fetching featured menu items:", error);
      res.status(500).json({ success: false, message: "Greška pri učitavanju istaknutih proizvoda" });
    }
  });

  // Get menu items by category
  app.get("/api/menu-items/category/:category", async (req, res) => {
    try {
      const { category } = req.params;
      const items = await storage.getMenuItemsByCategory(category);
      res.json({ success: true, items });
    } catch (error) {
      console.error("Error fetching menu items by category:", error);
      res.status(500).json({ success: false, message: "Greška pri učitavanju stavki" });
    }
  });

  // Create menu item (admin only)
  app.post("/api/menu-items", requireAuth, async (req, res) => {
    try {
      const validatedData = insertMenuItemSchema.parse(req.body);
      const newItem = await storage.createMenuItem(validatedData);
      res.json({ success: true, message: "Stavka kreirana!", item: newItem });
    } catch (error) {
      console.error("Error creating menu item:", error);
      res.status(400).json({ success: false, message: "Greška pri kreiranju stavke" });
    }
  });

  // Update menu item (admin only)
  app.put("/api/menu-items/:id", requireAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const validatedData = updateMenuItemSchema.parse(req.body);
      const updatedItem = await storage.updateMenuItem(id, validatedData);
      if (!updatedItem) {
        return res.status(404).json({ success: false, message: "Stavka nije pronađena" });
      }
      res.json({ success: true, message: "Stavka ažurirana!", item: updatedItem });
    } catch (error) {
      console.error("Error updating menu item:", error);
      res.status(400).json({ success: false, message: "Greška pri ažuriranju stavke" });
    }
  });

  // Delete menu item (admin only)
  app.delete("/api/menu-items/:id", requireAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteMenuItem(id);
      res.json({ success: true, message: "Stavka obrisana!" });
    } catch (error) {
      console.error("Error deleting menu item:", error);
      res.status(500).json({ success: false, message: "Greška pri brisanju stavke" });
    }
  });

  // Upload image (admin only)
  app.post("/api/upload", requireAuth, upload.single("image"), (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ success: false, message: "Slika nije izabrana" });
      }
      const imageUrl = `/uploads/${req.file.filename}`;
      res.json({ success: true, message: "Slika upload-ovana!", imageUrl });
    } catch (error) {
      console.error("Error uploading image:", error);
      res.status(500).json({ success: false, message: "Greška pri upload-u slike" });
    }
  });

  // Gallery API Endpoints
  
  // Get all gallery images
  app.get("/api/gallery-images", async (req, res) => {
    try {
      const images = await storage.getAllGalleryImages();
      res.json({ success: true, images });
    } catch (error) {
      console.error("Error fetching gallery images:", error);
      res.status(500).json({ success: false, message: "Greška pri učitavanju slika" });
    }
  });

  // Create gallery image (admin only)
  app.post("/api/gallery-images", requireAuth, async (req, res) => {
    try {
      const validatedData = insertGalleryImageSchema.parse(req.body);
      const newImage = await storage.createGalleryImage(validatedData);
      res.json({ success: true, message: "Slika dodata u galeriju!", image: newImage });
    } catch (error) {
      console.error("Error creating gallery image:", error);
      res.status(400).json({ success: false, message: "Greška pri dodavanju slike" });
    }
  });

  // Delete gallery image (admin only)
  app.delete("/api/gallery-images/:id", requireAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteGalleryImage(id);
      res.json({ success: true, message: "Slika obrisana iz galerije!" });
    } catch (error) {
      console.error("Error deleting gallery image:", error);
      res.status(500).json({ success: false, message: "Greška pri brisanju slike" });
    }
  });

  // Site Content API Endpoints
  
  // Get all site content
  app.get("/api/site-content", async (req, res) => {
    try {
      const contentMap = await storage.getAllSiteContent();
      const content = Object.fromEntries(contentMap);
      res.json({ success: true, content });
    } catch (error) {
      console.error("Error fetching site content:", error);
      res.status(500).json({ success: false, message: "Greška pri učitavanju sadržaja" });
    }
  });

  // Update site content (admin only)
  app.put("/api/site-content/:key", requireAuth, async (req, res) => {
    try {
      const { key } = req.params;
      const { value } = req.body;
      await storage.updateSiteContent(key, value);
      res.json({ success: true, message: "Sadržaj ažuriran!" });
    } catch (error) {
      console.error("Error updating site content:", error);
      res.status(500).json({ success: false, message: "Greška pri ažuriranju sadržaja" });
    }
  });

  // Coupons API Endpoints
  
  // Get all coupons (admin only)
  app.get("/api/coupons", requireAuth, async (req, res) => {
    try {
      const coupons = await storage.getAllCoupons();
      res.json({ success: true, coupons });
    } catch (error) {
      console.error("Error fetching coupons:", error);
      res.status(500).json({ success: false, message: "Greška pri učitavanju kupona" });
    }
  });

  // Validate coupon (public endpoint for checkout)
  app.post("/api/coupons/validate", async (req, res) => {
    try {
      const { code, orderValue } = req.body;
      const coupon = await storage.validateCoupon(code, orderValue);
      if (!coupon) {
        return res.status(404).json({ success: false, message: "Kupon nije pronađen ili nije validan" });
      }
      res.json({ success: true, coupon });
    } catch (error) {
      console.error("Error validating coupon:", error);
      res.status(500).json({ success: false, message: "Greška pri validaciji kupona" });
    }
  });

  // Create coupon (admin only)
  app.post("/api/coupons", requireAuth, async (req, res) => {
    try {
      const coupon = await storage.createCoupon(req.body);
      res.json({ success: true, coupon, message: "Kupon kreiran!" });
    } catch (error) {
      console.error("Error creating coupon:", error);
      res.status(500).json({ success: false, message: "Greška pri kreiranju kupona" });
    }
  });

  // Update coupon (admin only)
  app.put("/api/coupons/:id", requireAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const coupon = await storage.updateCoupon(id, req.body);
      res.json({ success: true, coupon, message: "Kupon ažuriran!" });
    } catch (error) {
      console.error("Error updating coupon:", error);
      res.status(500).json({ success: false, message: "Greška pri ažuriranju kupona" });
    }
  });

  // Delete coupon (admin only)
  app.delete("/api/coupons/:id", requireAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteCoupon(id);
      res.json({ success: true, message: "Kupon obrisan!" });
    } catch (error) {
      console.error("Error deleting coupon:", error);
      res.status(500).json({ success: false, message: "Greška pri brisanju kupona" });
    }
  });

  // Reviews API Endpoints
  
  // Get all reviews (public - returns only approved, admin returns all)
  app.get("/api/reviews", async (req, res) => {
    try {
      const isAdmin = !!req.session?.userId;
      const reviews = await storage.getAllReviews(isAdmin);
      res.json({ success: true, reviews });
    } catch (error) {
      console.error("Error fetching reviews:", error);
      res.status(500).json({ success: false, message: "Greška pri učitavanju recenzija" });
    }
  });

  // Create review (public endpoint)
  app.post("/api/reviews", async (req, res) => {
    try {
      const review = await storage.createReview(req.body);
      res.json({ success: true, review, message: "Hvala na recenziji! Biće objavljena nakon odobrenja." });
    } catch (error) {
      console.error("Error creating review:", error);
      res.status(500).json({ success: false, message: "Greška pri kreiranju recenzije" });
    }
  });

  // Approve review (admin only)
  app.put("/api/reviews/:id/approve", requireAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const review = await storage.approveReview(id);
      res.json({ success: true, review, message: "Recenzija odobrena!" });
    } catch (error) {
      console.error("Error approving review:", error);
      res.status(500).json({ success: false, message: "Greška pri odobravanju recenzije" });
    }
  });

  // Delete review (admin only)
  app.delete("/api/reviews/:id", requireAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteReview(id);
      res.json({ success: true, message: "Recenzija obrisana!" });
    } catch (error) {
      console.error("Error deleting review:", error);
      res.status(500).json({ success: false, message: "Greška pri brisanju recenzije" });
    }
  });

  // Fetch Google reviews (admin only)
  app.post("/api/reviews/fetch-from-google", requireAuth, async (req, res) => {
    try {
      // Get Google API settings
      const apiKeySetting = await storage.getSetting("google_places_api_key");
      const placeIdSetting = await storage.getSetting("google_place_id");

      if (!apiKeySetting || !placeIdSetting) {
        return res.status(400).json({ 
          success: false, 
          message: "Google Places API key i Place ID moraju biti podešeni u Postavkama" 
        });
      }

      const apiKey = apiKeySetting;
      const placeId = placeIdSetting;

      // Fetch reviews from Google Places API
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=reviews&key=${apiKey}`
      );

      if (!response.ok) {
        throw new Error(`Google API error: ${response.statusText}`);
      }

      const data = await response.json() as any;

      if (data.status !== "OK") {
        throw new Error(`Google API returned status: ${data.status}`);
      }

      const googleReviews = data.result?.reviews || [];

      // Filter only good reviews (4-5 stars)
      const goodReviews = googleReviews.filter((review: any) => review.rating >= 4);

      let importedCount = 0;

      for (const googleReview of goodReviews) {
        // Check if review already exists
        const existing = await storage.getReviewByGoogleId(googleReview.time.toString());
        
        if (!existing) {
          // Import new review
          await storage.createReview({
            customerName: googleReview.author_name,
            rating: googleReview.rating,
            comment: googleReview.text || "Odlična usluga!",
            isApproved: true, // Auto-approve Google reviews
            source: "google",
            googleReviewId: googleReview.time.toString(),
            reviewDate: new Date(googleReview.time * 1000),
            profilePhotoUrl: googleReview.profile_photo_url,
          });
          importedCount++;
        }
      }

      res.json({ 
        success: true, 
        message: `Uvezeno ${importedCount} ${importedCount === 1 ? 'nova recenzija' : importedCount < 5 ? 'nove recenzije' : 'novih recenzija'} sa Google-a`,
        imported: importedCount,
        total: goodReviews.length 
      });
    } catch (error) {
      console.error("Error fetching Google reviews:", error);
      res.status(500).json({ success: false, message: "Greška pri povlačenju Google recenzija" });
    }
  });

  // Analytics API Endpoints
  
  // Get analytics dashboard data (admin only)
  app.get("/api/analytics", requireAuth, async (req, res) => {
    try {
      const analytics = await storage.getAnalytics();
      res.json({ success: true, analytics });
    } catch (error) {
      console.error("Error fetching analytics:", error);
      res.status(500).json({ success: false, message: "Greška pri učitavanju statistike" });
    }
  });

  // Backup/Export API Endpoints
  
  // Export all data as JSON backup (admin only)
  app.get("/api/backup/export", requireAuth, async (req, res) => {
    try {
      const backup = await storage.exportBackup();
      res.json({ success: true, backup, timestamp: new Date().toISOString() });
    } catch (error) {
      console.error("Error creating backup:", error);
      res.status(500).json({ success: false, message: "Greška pri kreiranju backup-a" });
    }
  });

  const httpServer = createServer(app);

  return { server: httpServer, seedAdminUser };
}
