import { sql } from "drizzle-orm";
import { pgTable, text, varchar, boolean, integer, serial, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const settings = pgTable("settings", {
  key: varchar("key").primaryKey(),
  value: text("value").notNull(),
});

export const menuItems = pgTable("menu_items", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  category: varchar("category", { length: 50 }).notNull(), // 'pizza', 'pasta', 'salad', 'breakfast', 'sandwich', 'main_course', 'coffee', 'juice', 'alcohol'
  price: integer("price"), // For items without sizes (drinks, salads, etc.)
  price32: integer("price32"), // DEPRECATED - use sizes instead
  price42: integer("price42"), // DEPRECATED - use sizes instead
  sizes: text("sizes"), // JSON array: [{ name: "32cm", price: 1200 }, { name: "42cm", price: 1800 }]
  imageUrl: text("image_url"),
  available: boolean("available").notNull().default(true),
  featured: boolean("featured").notNull().default(false),
  isNew: boolean("is_new").notNull().default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const galleryImages = pgTable("gallery_images", {
  id: serial("id").primaryKey(),
  imageUrl: text("image_url").notNull(),
  altText: text("alt_text").notNull(),
  displayOrder: integer("display_order").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

export const siteContent = pgTable("site_content", {
  key: varchar("key").primaryKey(),
  value: text("value").notNull(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const coupons = pgTable("coupons", {
  id: serial("id").primaryKey(),
  code: varchar("code", { length: 50 }).notNull().unique(),
  discountType: varchar("discount_type", { length: 20 }).notNull(), // 'percentage' or 'fixed'
  discountValue: integer("discount_value").notNull(), // Percentage (10 = 10%) or fixed amount in RSD
  minOrder: integer("min_order").default(0), // Minimum order value in RSD
  maxUses: integer("max_uses"), // null = unlimited
  usedCount: integer("used_count").notNull().default(0),
  expiresAt: timestamp("expires_at"),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

export const reviews = pgTable("reviews", {
  id: serial("id").primaryKey(),
  customerName: text("customer_name").notNull(),
  rating: integer("rating").notNull(), // 1-5 stars
  comment: text("comment").notNull(),
  isApproved: boolean("is_approved").notNull().default(false),
  source: varchar("source", { length: 20 }).notNull().default("manual"), // 'google' or 'manual'
  googleReviewId: text("google_review_id"), // Unique ID from Google (for de-duplication)
  reviewDate: timestamp("review_date"), // Date from Google
  profilePhotoUrl: text("profile_photo_url"), // User photo from Google
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

// Product size schema
export const productSizeSchema = z.object({
  name: z.string().min(1, "Naziv veličine je obavezan"),
  price: z.number().positive("Cena mora biti veća od 0"),
});

export type ProductSize = z.infer<typeof productSizeSchema>;

export const insertMenuItemSchema = createInsertSchema(menuItems).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
}).superRefine((data, ctx) => {
  // Parse sizes if provided
  let parsedSizes: ProductSize[] | null = null;
  if (data.sizes) {
    try {
      parsedSizes = JSON.parse(data.sizes);
      // Validate each size
      if (Array.isArray(parsedSizes)) {
        parsedSizes.forEach((size, index) => {
          const result = productSizeSchema.safeParse(size);
          if (!result.success) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: `Veličina ${index + 1}: ${result.error.errors[0].message}`,
              path: ["sizes"],
            });
          }
        });
      } else {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Veličine moraju biti lista",
          path: ["sizes"],
        });
      }
    } catch (e) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Neispravan JSON format za veličine",
        path: ["sizes"],
      });
    }
  }

  // Validation: Must have either price OR sizes (or legacy price32/price42)
  const hasSizes = parsedSizes && parsedSizes.length > 0;
  const hasPrice = typeof data.price === "number" && data.price > 0;
  const hasLegacyPrices = (typeof data.price32 === "number" && data.price32 > 0) || 
                          (typeof data.price42 === "number" && data.price42 > 0);

  if (!hasSizes && !hasPrice && !hasLegacyPrices) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Proizvod mora imati ili cenu ili veličine",
      path: ["price"],
    });
  }

  // Cannot have both sizes and regular price
  if (hasSizes && hasPrice) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Proizvod ne može imati i cenu i veličine",
      path: ["price"],
    });
  }
});

export const updateMenuItemSchema = createInsertSchema(menuItems).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
}).partial().superRefine((data, ctx) => {
  // Validate sizes if provided
  if (data.sizes !== undefined && data.sizes !== null) {
    try {
      const parsedSizes = JSON.parse(data.sizes);
      if (Array.isArray(parsedSizes)) {
        parsedSizes.forEach((size, index) => {
          const result = productSizeSchema.safeParse(size);
          if (!result.success) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: `Veličina ${index + 1}: ${result.error.errors[0].message}`,
              path: ["sizes"],
            });
          }
        });
      } else {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Veličine moraju biti lista",
          path: ["sizes"],
        });
      }
    } catch (e) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Neispravan JSON format za veličine",
        path: ["sizes"],
      });
    }
  }
});

export const insertGalleryImageSchema = createInsertSchema(galleryImages).omit({
  id: true,
  createdAt: true,
});

export const insertSiteContentSchema = createInsertSchema(siteContent);

export const insertCouponSchema = createInsertSchema(coupons).omit({
  id: true,
  usedCount: true,
  createdAt: true,
}).superRefine((data, ctx) => {
  if (data.discountType !== "percentage" && data.discountType !== "fixed") {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Tip popusta mora biti 'percentage' ili 'fixed'",
      path: ["discountType"],
    });
  }
  if (data.discountType === "percentage" && (data.discountValue < 1 || data.discountValue > 100)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Procenat popusta mora biti između 1 i 100",
      path: ["discountValue"],
    });
  }
  if (data.discountType === "fixed" && data.discountValue < 1) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Fiksni popust mora biti veći od 0",
      path: ["discountValue"],
    });
  }
});

export const insertReviewSchema = createInsertSchema(reviews).omit({
  id: true,
  createdAt: true,
}).superRefine((data, ctx) => {
  if (data.rating < 1 || data.rating > 5) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Ocena mora biti između 1 i 5",
      path: ["rating"],
    });
  }
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type Setting = typeof settings.$inferSelect;
export type MenuItem = typeof menuItems.$inferSelect;
export type InsertMenuItem = z.infer<typeof insertMenuItemSchema>;
export type UpdateMenuItem = z.infer<typeof updateMenuItemSchema>;
export type GalleryImage = typeof galleryImages.$inferSelect;
export type InsertGalleryImage = z.infer<typeof insertGalleryImageSchema>;
export type SiteContent = typeof siteContent.$inferSelect;
export type InsertSiteContent = z.infer<typeof insertSiteContentSchema>;
export type Coupon = typeof coupons.$inferSelect;
export type InsertCoupon = z.infer<typeof insertCouponSchema>;
export type Review = typeof reviews.$inferSelect;
export type InsertReview = z.infer<typeof insertReviewSchema>;
