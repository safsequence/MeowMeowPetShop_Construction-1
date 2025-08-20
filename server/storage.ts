import { users, products, categories, brands, type User, type InsertUser } from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";
import { nanoid } from "nanoid";

// Simple storage for the pet shop
interface SimpleProduct {
  id: string;
  name: string;
  price: number;
  category: string;
  image: string;
  rating: number;
  stock: number;
}

interface SimpleCategory {
  id: string;
  name: string;
  products: SimpleProduct[];
}

interface SimpleBrand {
  id: string;
  name: string;
  slug: string;
  logo: string;
  description: string;
}

export interface IStorage {
  getCategories(): Promise<SimpleCategory[]>;
  getBrands(): Promise<SimpleBrand[]>;
  getProducts(): Promise<SimpleProduct[]>;
  getProduct(id: string): Promise<SimpleProduct | undefined>;
  createProduct(product: Omit<SimpleProduct, 'id'>): Promise<SimpleProduct>;
  updateProduct(id: string, product: Partial<SimpleProduct>): Promise<SimpleProduct | undefined>;
  deleteProduct(id: string): Promise<boolean>;
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(insertUser: InsertUser): Promise<User>;
  updateUser(id: string, userData: Partial<InsertUser>): Promise<User | undefined>;
}

export class DatabaseStorage implements IStorage {
  private categories: SimpleCategory[];

  constructor() {
    this.categories = [
      {
        id: 'cat-food',
        name: 'Cat Food',
        products: []
      },
      {
        id: 'dog-food', 
        name: 'Dog Food',
        products: []
      },
      {
        id: 'cat-toys',
        name: 'Cat Toys',
        products: []
      },
      {
        id: 'cat-litter',
        name: 'Cat Litter',
        products: []
      },
      {
        id: 'reflex',
        name: 'Reflex Brand',
        products: []
      }
    ];
  }

  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    // Prevent any new admin users from being created
    const userToInsert = { ...insertUser, role: "user" };
    
    const [user] = await db
      .insert(users)
      .values(userToInsert)
      .returning();
    return user;
  }

  async updateUser(id: string, userData: Partial<InsertUser>): Promise<User | undefined> {
    const [user] = await db
      .update(users)
      .set({ ...userData, updatedAt: new Date() })
      .where(eq(users.id, id))
      .returning();
    return user || undefined;
  }

  async getProduct(id: string): Promise<SimpleProduct | undefined> {
    try {
      const [product] = await db
        .select({
          id: products.id,
          name: products.name,
          price: products.price,
          category: categories.name,
          image: products.image,
          rating: products.rating,
          stock: products.stockQuantity,
        })
        .from(products)
        .leftJoin(categories, eq(products.categoryId, categories.id))
        .where(eq(products.id, id));
      
      if (!product) return undefined;
      
      return {
        id: product.id,
        name: product.name,
        price: parseFloat(product.price || '0'),
        category: product.category || 'uncategorized',
        image: product.image,
        rating: parseFloat(product.rating || '0'),
        stock: product.stock || 0,
      };
    } catch (error) {
      console.error('Error fetching product:', error);
      return undefined;
    }
  }

  async createProduct(productData: Omit<SimpleProduct, 'id'>): Promise<SimpleProduct> {
    const productId = nanoid();
    
    // Find or create category
    let categoryRecord = await db.select().from(categories).where(eq(categories.name, productData.category)).limit(1);
    if (categoryRecord.length === 0) {
      const [newCategory] = await db
        .insert(categories)
        .values({
          name: productData.category,
          slug: productData.category.toLowerCase().replace(/\s+/g, '-'),
        })
        .returning();
      categoryRecord = [newCategory];
    }

    // Create a default brand if needed
    let brandRecord = await db.select().from(brands).limit(1);
    if (brandRecord.length === 0) {
      const [newBrand] = await db
        .insert(brands)
        .values({
          name: 'Default Brand',
          slug: 'default-brand',
        })
        .returning();
      brandRecord = [newBrand];
    }

    const [newProduct] = await db
      .insert(products)
      .values({
        id: productId,
        name: productData.name,
        description: `High-quality ${productData.name}`,
        price: productData.price.toString(),
        categoryId: categoryRecord[0].id,
        brandId: brandRecord[0].id,
        image: productData.image,
        rating: productData.rating.toString(),
        stockQuantity: productData.stock,
      })
      .returning();

    return {
      id: newProduct.id,
      name: newProduct.name,
      price: parseFloat(newProduct.price),
      category: productData.category,
      image: newProduct.image,
      rating: parseFloat(newProduct.rating || '0'),
      stock: newProduct.stockQuantity || 0,
    };
  }

  async updateProduct(id: string, productData: Partial<SimpleProduct>): Promise<SimpleProduct | undefined> {
    try {
      const updateData: any = {};
      
      if (productData.name) updateData.name = productData.name;
      if (productData.price !== undefined) updateData.price = productData.price.toString();
      if (productData.image) updateData.image = productData.image;
      if (productData.rating !== undefined) updateData.rating = productData.rating.toString();
      if (productData.stock !== undefined) updateData.stockQuantity = productData.stock;
      
      updateData.updatedAt = new Date();

      const [updatedProduct] = await db
        .update(products)
        .set(updateData)
        .where(eq(products.id, id))
        .returning();

      if (!updatedProduct) return undefined;

      return this.getProduct(id);
    } catch (error) {
      console.error('Error updating product:', error);
      return undefined;
    }
  }

  async deleteProduct(id: string): Promise<boolean> {
    try {
      const result = await db.delete(products).where(eq(products.id, id));
      return result.rowCount !== undefined && result.rowCount !== null && result.rowCount > 0;
    } catch (error) {
      console.error('Error deleting product:', error);
      return false;
    }
  }

  async getCategories(): Promise<SimpleCategory[]> {
    try {
      // Get categories and their products from database
      const dbCategories = await db.select().from(categories).where(eq(categories.isActive, true));
      const dbProducts = await db
        .select({
          id: products.id,
          name: products.name,
          price: products.price,
          categoryId: products.categoryId,
          image: products.image,
          rating: products.rating,
          stock: products.stockQuantity,
        })
        .from(products)
        .where(eq(products.isActive, true));

      const categoriesWithProducts = dbCategories.map(cat => ({
        id: cat.slug,
        name: cat.name,
        products: dbProducts
          .filter(prod => prod.categoryId === cat.id)
          .map(prod => ({
            id: prod.id,
            name: prod.name,
            price: parseFloat(prod.price),
            category: cat.slug,
            image: prod.image,
            rating: parseFloat(prod.rating || '0'),
            stock: prod.stock || 0,
          }))
      }));

      // If no categories in database, return the in-memory ones and seed the database
      if (categoriesWithProducts.length === 0) {
        await this.seedDatabase();
        return this.categories;
      }

      return categoriesWithProducts;
    } catch (error) {
      console.error('Error fetching categories:', error);
      // Fallback to in-memory data
      return this.categories;
    }
  }

  async getBrands(): Promise<SimpleBrand[]> {
    try {
      const dbBrands = await db.select().from(brands).where(eq(brands.isActive, true));
      return dbBrands.map(brand => ({
        id: brand.id,
        name: brand.name,
        slug: brand.slug,
        logo: brand.logo || '',
        description: brand.description || ''
      }));
    } catch (error) {
      console.error('Error fetching brands:', error);
      return [];
    }
  }

  async getProducts(): Promise<SimpleProduct[]> {
    try {
      const dbProducts = await db
        .select({
          id: products.id,
          name: products.name,
          price: products.price,
          category: categories.name,
          image: products.image,
          rating: products.rating,
          stock: products.stockQuantity,
        })
        .from(products)
        .leftJoin(categories, eq(products.categoryId, categories.id))
        .where(eq(products.isActive, true));

      if (dbProducts.length === 0) {
        await this.seedDatabase();
        return this.categories.flatMap(cat => cat.products);
      }

      return dbProducts.map(prod => ({
        id: prod.id,
        name: prod.name,
        price: parseFloat(prod.price),
        category: prod.category || 'uncategorized',
        image: prod.image,
        rating: parseFloat(prod.rating || '0'),
        stock: prod.stock || 0,
      }));
    } catch (error) {
      console.error('Error fetching products:', error);
      return this.categories.flatMap(cat => cat.products);
    }
  }

  private async seedDatabase(): Promise<void> {
    try {
      console.log('Seeding database with initial data...');
      
      // Create categories
      for (const category of this.categories) {
        const [dbCategory] = await db
          .insert(categories)
          .values({
            name: category.name,
            slug: category.id,
          })
          .onConflictDoNothing()
          .returning();

        if (dbCategory) {
          // Create default brand
          let [brand] = await db
            .select()
            .from(brands)
            .where(eq(brands.name, 'Default Brand'))
            .limit(1);
          
          if (!brand) {
            [brand] = await db
              .insert(brands)
              .values({
                name: 'Default Brand',
                slug: 'default-brand',
              })
              .returning();
          }

          // Create products for this category
          for (const product of category.products) {
            await db
              .insert(products)
              .values({
                id: product.id,
                name: product.name,
                description: `High-quality ${product.name}`,
                price: product.price.toString(),
                categoryId: dbCategory.id,
                brandId: brand.id,
                image: product.image,
                rating: product.rating.toString(),
                stockQuantity: product.stock,
              })
              .onConflictDoNothing();
          }
        }
      }
      
      console.log('Database seeded successfully');
    } catch (error) {
      console.error('Error seeding database:', error);
    }
  }
}

export const storage = new DatabaseStorage();