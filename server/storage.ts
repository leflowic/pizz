import { type User, type InsertUser, users, settings, type Setting, menuItems, type MenuItem, type InsertMenuItem, type UpdateMenuItem, galleryImages, type GalleryImage, type InsertGalleryImage, siteContent, type SiteContent, coupons, type Coupon, type InsertCoupon, reviews, type Review, type InsertReview } from "@shared/schema";
import { db } from "./db";
import { eq, sql as sqlOp, desc } from "drizzle-orm";
import bcrypt from "bcrypt";

const SALT_ROUNDS = 10;

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getAllUsers(): Promise<User[]>;
  createUser(user: InsertUser): Promise<User>;
  verifyPassword(plainPassword: string, hashedPassword: string): Promise<boolean>;
  getSetting(key: string): Promise<string | undefined>;
  setSetting(key: string, value: string): Promise<void>;
  
  // Menu Items
  getAllMenuItems(): Promise<MenuItem[]>;
  getMenuItemsByCategory(category: string): Promise<MenuItem[]>;
  getFeaturedMenuItems(): Promise<MenuItem[]>;
  getMenuItem(id: number): Promise<MenuItem | undefined>;
  createMenuItem(item: InsertMenuItem): Promise<MenuItem>;
  updateMenuItem(id: number, item: UpdateMenuItem): Promise<MenuItem | undefined>;
  deleteMenuItem(id: number): Promise<void>;
  
  // Gallery Images
  getAllGalleryImages(): Promise<GalleryImage[]>;
  createGalleryImage(image: InsertGalleryImage): Promise<GalleryImage>;
  deleteGalleryImage(id: number): Promise<void>;
  
  // Site Content
  getAllSiteContent(): Promise<Map<string, string>>;
  updateSiteContent(key: string, value: string): Promise<void>;
  
  // Coupons
  getAllCoupons(): Promise<Coupon[]>;
  validateCoupon(code: string, orderValue: number): Promise<Coupon | null>;
  createCoupon(coupon: InsertCoupon): Promise<Coupon>;
  updateCoupon(id: number, coupon: Partial<InsertCoupon>): Promise<Coupon>;
  deleteCoupon(id: number): Promise<void>;
  
  // Reviews
  getAllReviews(isAdmin?: boolean): Promise<Review[]>;
  createReview(review: InsertReview): Promise<Review>;
  approveReview(id: number): Promise<Review>;
  deleteReview(id: number): Promise<void>;
  
  // Analytics
  getAnalytics(): Promise<any>;
  
  // Backup
  exportBackup(): Promise<any>;
}

export class PostgresStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.id, id));
    return result[0];
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.username, username));
    return result[0];
  }

  async getAllUsers(): Promise<User[]> {
    return await db.select().from(users);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const hashedPassword = await bcrypt.hash(insertUser.password, SALT_ROUNDS);
    const result = await db.insert(users).values({
      username: insertUser.username,
      password: hashedPassword,
    }).returning();
    return result[0];
  }

  async verifyPassword(plainPassword: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(plainPassword, hashedPassword);
  }

  async getSetting(key: string): Promise<string | undefined> {
    const result = await db.select().from(settings).where(eq(settings.key, key));
    return result[0]?.value;
  }

  async setSetting(key: string, value: string): Promise<void> {
    const existing = await db.select().from(settings).where(eq(settings.key, key));
    if (existing.length > 0) {
      await db.update(settings).set({ value }).where(eq(settings.key, key));
    } else {
      await db.insert(settings).values({ key, value });
    }
  }

  async getAllMenuItems(): Promise<MenuItem[]> {
    return await db.select().from(menuItems);
  }

  async getMenuItemsByCategory(category: string): Promise<MenuItem[]> {
    return await db.select().from(menuItems).where(eq(menuItems.category, category));
  }

  async getFeaturedMenuItems(): Promise<MenuItem[]> {
    return await db.select().from(menuItems).where(eq(menuItems.featured, true));
  }

  async getMenuItem(id: number): Promise<MenuItem | undefined> {
    const result = await db.select().from(menuItems).where(eq(menuItems.id, id));
    return result[0];
  }

  async createMenuItem(item: InsertMenuItem): Promise<MenuItem> {
    const result = await db.insert(menuItems).values(item).returning();
    return result[0];
  }

  async updateMenuItem(id: number, item: UpdateMenuItem): Promise<MenuItem | undefined> {
    // Filter out undefined values to ensure all defined fields are updated
    const updateData = Object.fromEntries(
      Object.entries(item).filter(([_, value]) => value !== undefined)
    );
    
    const result = await db
      .update(menuItems)
      .set({ ...updateData, updatedAt: new Date() })
      .where(eq(menuItems.id, id))
      .returning();
    return result[0];
  }

  async deleteMenuItem(id: number): Promise<void> {
    await db.delete(menuItems).where(eq(menuItems.id, id));
  }

  async getAllGalleryImages(): Promise<GalleryImage[]> {
    return await db.select().from(galleryImages).orderBy(galleryImages.displayOrder);
  }

  async createGalleryImage(image: InsertGalleryImage): Promise<GalleryImage> {
    const result = await db.insert(galleryImages).values(image).returning();
    return result[0];
  }

  async deleteGalleryImage(id: number): Promise<void> {
    await db.delete(galleryImages).where(eq(galleryImages.id, id));
  }

  async getAllSiteContent(): Promise<Map<string, string>> {
    const result = await db.select().from(siteContent);
    const contentMap = new Map<string, string>();
    result.forEach(row => contentMap.set(row.key, row.value));
    return contentMap;
  }

  async updateSiteContent(key: string, value: string): Promise<void> {
    await db
      .update(siteContent)
      .set({ value, updatedAt: new Date() })
      .where(eq(siteContent.key, key));
  }

  // Coupons methods
  async getAllCoupons(): Promise<Coupon[]> {
    return await db.select().from(coupons).orderBy(desc(coupons.createdAt));
  }

  async validateCoupon(code: string, orderValue: number): Promise<Coupon | null> {
    const result = await db.select().from(coupons).where(eq(coupons.code, code));
    const coupon = result[0];
    
    if (!coupon) return null;
    if (!coupon.isActive) return null;
    if (coupon.expiresAt && new Date(coupon.expiresAt) < new Date()) return null;
    if (coupon.minOrder && orderValue < coupon.minOrder) return null;
    if (coupon.maxUses && coupon.usedCount >= coupon.maxUses) return null;
    
    return coupon;
  }

  async createCoupon(coupon: InsertCoupon): Promise<Coupon> {
    const result = await db.insert(coupons).values(coupon).returning();
    return result[0];
  }

  async updateCoupon(id: number, coupon: Partial<InsertCoupon>): Promise<Coupon> {
    const result = await db
      .update(coupons)
      .set(coupon)
      .where(eq(coupons.id, id))
      .returning();
    return result[0];
  }

  async deleteCoupon(id: number): Promise<void> {
    await db.delete(coupons).where(eq(coupons.id, id));
  }

  // Reviews methods
  async getAllReviews(isAdmin?: boolean): Promise<Review[]> {
    if (isAdmin) {
      return await db.select().from(reviews).orderBy(desc(reviews.createdAt));
    } else {
      return await db.select().from(reviews).where(eq(reviews.isApproved, true)).orderBy(desc(reviews.createdAt));
    }
  }

  async createReview(review: InsertReview): Promise<Review> {
    const result = await db.insert(reviews).values(review).returning();
    return result[0];
  }

  async approveReview(id: number): Promise<Review> {
    const result = await db
      .update(reviews)
      .set({ isApproved: true })
      .where(eq(reviews.id, id))
      .returning();
    return result[0];
  }

  async deleteReview(id: number): Promise<void> {
    await db.delete(reviews).where(eq(reviews.id, id));
  }

  async getReviewByGoogleId(googleReviewId: string): Promise<Review | null> {
    const result = await db
      .select()
      .from(reviews)
      .where(eq(reviews.googleReviewId, googleReviewId))
      .limit(1);
    return result[0] || null;
  }

  // Analytics method
  async getAnalytics(): Promise<any> {
    // Get menu items statistics
    const totalItems = await db.select({ count: sqlOp<number>`count(*)::int` }).from(menuItems);
    const availableItems = await db.select({ count: sqlOp<number>`count(*)::int` }).from(menuItems).where(eq(menuItems.available, true));
    const featuredItems = await db.select({ count: sqlOp<number>`count(*)::int` }).from(menuItems).where(eq(menuItems.featured, true));
    
    // Get reviews statistics
    const totalReviews = await db.select({ count: sqlOp<number>`count(*)::int` }).from(reviews);
    const approvedReviews = await db.select({ count: sqlOp<number>`count(*)::int` }).from(reviews).where(eq(reviews.isApproved, true));
    const avgRating = await db.select({ avg: sqlOp<number>`AVG(rating)::float` }).from(reviews).where(eq(reviews.isApproved, true));
    
    // Get coupons statistics
    const totalCoupons = await db.select({ count: sqlOp<number>`count(*)::int` }).from(coupons);
    const activeCoupons = await db.select({ count: sqlOp<number>`count(*)::int` }).from(coupons).where(eq(coupons.isActive, true));
    
    // Get top rated items (with reviews - future feature)
    const topItems = await db.select().from(menuItems).where(eq(menuItems.featured, true)).limit(5);
    
    return {
      menuItems: {
        total: totalItems[0]?.count || 0,
        available: availableItems[0]?.count || 0,
        featured: featuredItems[0]?.count || 0,
      },
      reviews: {
        total: totalReviews[0]?.count || 0,
        approved: approvedReviews[0]?.count || 0,
        averageRating: avgRating[0]?.avg || 0,
      },
      coupons: {
        total: totalCoupons[0]?.count || 0,
        active: activeCoupons[0]?.count || 0,
      },
      topItems,
    };
  }

  // Backup/Export method
  async exportBackup(): Promise<any> {
    const allMenuItems = await this.getAllMenuItems();
    const allGalleryImages = await this.getAllGalleryImages();
    const allSiteContent = await this.getAllSiteContent();
    const allCoupons = await this.getAllCoupons();
    const allReviews = await this.getAllReviews(true);
    
    return {
      menuItems: allMenuItems,
      galleryImages: allGalleryImages,
      siteContent: Object.fromEntries(allSiteContent),
      coupons: allCoupons,
      reviews: allReviews,
    };
  }
}

export const storage = new PostgresStorage();
