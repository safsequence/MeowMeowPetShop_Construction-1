import { db } from "./db";
import { users, categories, brands, products, blogPosts, orders } from "@shared/schema";
import type { User, Category, Brand, Product } from "@shared/schema";
import { eq, and } from "drizzle-orm";
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

interface InsertUser {
  username: string;
  password: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  address?: any;
  profilePicture?: string;
  role?: string;
  isActive?: boolean;
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
    const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
    return result[0] || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.username, username)).limit(1);
    return result[0] || undefined;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    if (!email) return undefined;
    const result = await db.select().from(users).where(eq(users.email, email)).limit(1);
    return result[0] || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    // Prevent any new admin users from being created
    const userToInsert = { ...insertUser, role: "user" };
    
    const result = await db.insert(users).values(userToInsert).returning();
    return result[0];
  }

  async updateUser(id: string, userData: Partial<InsertUser>): Promise<User | undefined> {
    const result = await db.update(users)
      .set({ ...userData, updatedAt: new Date() })
      .where(eq(users.id, id))
      .returning();
    return result[0] || undefined;
  }

  async getProduct(id: string): Promise<SimpleProduct | undefined> {
    try {
      const productResult = await db.select().from(products).where(eq(products.id, id)).limit(1);
      if (productResult.length === 0) return undefined;

      const product = productResult[0];
      const categoryResult = await db.select().from(categories).where(eq(categories.id, product.categoryId)).limit(1);
      const category = categoryResult[0];
      
      return {
        id: product.id,
        name: product.name,
        price: Number(product.price),
        category: category?.name || 'uncategorized',
        image: product.image,
        rating: Number(product.rating) || 0,
        stock: product.stockQuantity || 0,
      };
    } catch (error) {
      console.error('Error fetching product:', error);
      return undefined;
    }
  }

  async createProduct(productData: Omit<SimpleProduct, 'id'>): Promise<SimpleProduct> {
    // Find or create category
    let categoryRecord = await Category.findOne({ name: productData.category });
    if (!categoryRecord) {
      categoryRecord = new Category({
        name: productData.category,
        slug: productData.category.toLowerCase().replace(/\s+/g, '-'),
      });
      await categoryRecord.save();
    }

    // Create a default brand if needed
    let brandRecord = await Brand.findOne();
    if (!brandRecord) {
      brandRecord = new Brand({
        name: 'Default Brand',
        slug: 'default-brand',
      });
      await brandRecord.save();
    }

    const newProduct = new Product({
      name: productData.name,
      description: `High-quality ${productData.name}`,
      price: productData.price,
      categoryId: categoryRecord._id.toString(),
      brandId: brandRecord._id.toString(),
      image: productData.image,
      rating: productData.rating,
      stockQuantity: productData.stock,
    });

    await newProduct.save();

    return {
      id: newProduct._id.toString(),
      name: newProduct.name,
      price: newProduct.price,
      category: productData.category,
      image: newProduct.image,
      rating: newProduct.rating || 0,
      stock: newProduct.stockQuantity || 0,
    };
  }

  async updateProduct(id: string, productData: Partial<SimpleProduct>): Promise<SimpleProduct | undefined> {
    try {
      const updateData: any = {};
      
      if (productData.name) updateData.name = productData.name;
      if (productData.price !== undefined) updateData.price = productData.price;
      if (productData.image) updateData.image = productData.image;
      if (productData.rating !== undefined) updateData.rating = productData.rating;
      if (productData.stock !== undefined) updateData.stockQuantity = productData.stock;
      
      updateData.updatedAt = new Date();

      const updatedProduct = await Product.findByIdAndUpdate(id, updateData, { new: true });
      if (!updatedProduct) return undefined;

      return this.getProduct(id);
    } catch (error) {
      console.error('Error updating product:', error);
      return undefined;
    }
  }

  async deleteProduct(id: string): Promise<boolean> {
    try {
      const result = await Product.findByIdAndDelete(id);
      return !!result;
    } catch (error) {
      console.error('Error deleting product:', error);
      return false;
    }
  }

  async getCategories(): Promise<SimpleCategory[]> {
    try {
      // Get categories and their products from database
      const dbCategories = await Category.find({ isActive: true });
      const dbProducts = await Product.find({ isActive: true });

      const categoriesWithProducts = dbCategories.map(cat => ({
        id: cat.slug,
        name: cat.name,
        products: dbProducts
          .filter(prod => prod.categoryId.toString() === cat.id)
          .map(prod => ({
            id: prod.id,
            name: prod.name,
            price: prod.price,
            category: cat.slug,
            image: prod.image,
            rating: prod.rating || 0,
            stock: prod.stockQuantity || 0,
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
      const dbProducts = await Product.find({ isActive: true });

      if (dbProducts.length === 0) {
        await this.seedDatabase();
        return this.categories.flatMap(cat => cat.products);
      }

      const productsWithCategory = [];
      for (const prod of dbProducts) {
        try {
          const category = await Category.findById(prod.categoryId);
          productsWithCategory.push({
            id: prod.id,
            name: prod.name,
            price: prod.price,
            category: category?.slug || 'uncategorized',
            image: prod.image,
            rating: prod.rating || 0,
            stock: prod.stockQuantity || 0,
          });
        } catch (categoryError) {
          // If category lookup fails, still include the product with default category
          console.warn('Failed to find category for product:', prod.name, categoryError);
          productsWithCategory.push({
            id: prod.id,
            name: prod.name,
            price: prod.price,
            category: 'uncategorized',
            image: prod.image,
            rating: prod.rating || 0,
            stock: prod.stockQuantity || 0,
          });
        }
      }

      return productsWithCategory;
    } catch (error) {
      console.error('Error fetching products:', error);
      return [];
    }
  }

  private async seedDatabase(): Promise<void> {
    try {
      console.log('Seeding database with initial data...');
      
      // Create categories
      for (const category of this.categories) {
        const existingCategory = await Category.findOne({ slug: category.id });
        if (!existingCategory) {
          const dbCategory = new Category({
            name: category.name,
            slug: category.id,
          });
          await dbCategory.save();

          // Create default brand
          let brand = await Brand.findOne({ name: 'Default Brand' });
          if (!brand) {
            brand = new Brand({
              name: 'Default Brand',
              slug: 'default-brand',
            });
            await brand.save();
          }

          // Create products for this category
          for (const product of category.products) {
            const existingProduct = await Product.findOne({ name: product.name });
            if (!existingProduct) {
              const newProduct = new Product({
                name: product.name,
                description: `High-quality ${product.name}`,
                price: product.price,
                categoryId: dbCategory._id.toString(),
                brandId: brand._id.toString(),
                image: product.image,
                rating: product.rating,
                stockQuantity: product.stock,
              });
              await newProduct.save();
            }
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