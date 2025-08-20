import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { User, Product, Category, Brand } from "@shared/models";
import type { IUser } from "@shared/models";
import { z } from "zod";
import bcrypt from "bcrypt";
import multer from "multer";
import path from "path";
import { promises as fs } from "fs";

export async function registerRoutes(app: Express): Promise<Server> {
  // Configure multer for file uploads
  const uploadDir = path.join(process.cwd(), 'uploads');
  
  // Ensure upload directory exists
  try {
    await fs.access(uploadDir);
  } catch {
    await fs.mkdir(uploadDir, { recursive: true });
  }

  const storage_multer = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
  });

  const upload = multer({ 
    storage: storage_multer,
    limits: {
      fileSize: 5 * 1024 * 1024 // 5MB limit
    },
    fileFilter: function (req, file, cb) {
      // Check if file is an image
      if (file.mimetype.startsWith('image/')) {
        cb(null, true);
      } else {
        cb(new Error('Only image files are allowed!'));
      }
    }
  });

  // Image upload endpoint
  app.post('/api/upload/image', upload.single('image'), (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
      }

      const imageUrl = `/api/uploads/${req.file.filename}`;
      res.json({ 
        message: 'Image uploaded successfully',
        imageUrl: imageUrl,
        filename: req.file.filename
      });
    } catch (error) {
      console.error('Upload error:', error);
      res.status(500).json({ message: 'Upload failed' });
    }
  });

  // Serve uploaded images
  app.get('/api/uploads/:filename', (req, res) => {
    const filename = req.params.filename;
    const filepath = path.join(uploadDir, filename);
    res.sendFile(filepath);
  });

  // Categories API
  app.get("/api/categories", async (req, res) => {
    try {
      const categories = await storage.getCategories();
      res.json(categories);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch categories" });
    }
  });

  // Brands API
  app.get("/api/brands", async (req, res) => {
    try {
      const brands = await storage.getBrands();
      res.json(brands);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch brands" });
    }
  });

  // Products API
  app.get("/api/products", async (req, res) => {
    try {
      // Get products directly from MongoDB to avoid storage layer issues
      const dbProducts = await Product.find({ isActive: true });
      const products = [];
      
      for (const product of dbProducts) {
        try {
          let category = null;
          
          // Try to find category by ObjectId first
          try {
            category = await Category.findById(product.categoryId);
          } catch (objectIdError) {
            // If ObjectId lookup fails, try slug lookup
            category = await Category.findOne({ slug: product.categoryId });
          }
          
          // If still not found, try by name
          if (!category) {
            category = await Category.findOne({ name: product.categoryId });
          }

          products.push({
            id: product.id,
            name: product.name,
            price: product.price,
            originalPrice: product.originalPrice || null,
            category: category?.slug || 'uncategorized',
            categoryName: category?.name || 'Uncategorized',
            brandId: product.brandId,
            image: product.image,
            images: product.images || [],
            rating: product.rating || 0,
            reviews: product.reviews || 0,
            stock: product.stockQuantity || 0,
            stockStatus: product.stockStatus || 'In Stock',
            tags: product.tags || [],
            features: product.features || [],
            isNew: product.isNew || false,
            isBestseller: product.isBestseller || false,
            isOnSale: product.isOnSale || false,
            discount: product.discount || 0,
            description: product.description || '',
            specifications: product.specifications || {}
          });
        } catch (err) {
          // Skip products with invalid data but log the specific product name
          console.warn('Skipping product with invalid data:', product.name || 'Unknown', err.message);
        }
      }
      
      console.log(`Successfully fetched ${products.length} products`);
      res.json(products);
    } catch (error) {
      console.error('Error fetching products:', error);
      res.status(500).json({ message: "Failed to fetch products" });
    }
  });

  app.get("/api/products/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const product = await storage.getProduct(id);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      res.json(product);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch product" });
    }
  });

  app.post("/api/products", async (req, res) => {
    try {
      const productData = req.body;
      console.log('Received product data:', productData);
      
      // Parse tags if they exist (comma-separated string to array)
      const tags = productData.tags ? productData.tags.split(',').map((tag: string) => tag.trim()).filter((tag: string) => tag.length > 0) : [];
      
      // Find category and brand by their IDs/names
      let categoryRecord = await Category.findOne({ 
        $or: [
          { slug: productData.categoryId },
          { name: productData.categoryId }
        ]
      });
      
      if (!categoryRecord) {
        // Create category if it doesn't exist
        categoryRecord = new Category({
          name: productData.categoryId,
          slug: productData.categoryId.toLowerCase().replace(/\s+/g, '-'),
        });
        await categoryRecord.save();
      }
      
      let brandRecord = await Brand.findOne({ 
        $or: [
          { slug: productData.brandId },
          { name: productData.brandId }
        ]
      });
      
      if (!brandRecord) {
        // Create brand if it doesn't exist
        brandRecord = new Brand({
          name: productData.brandId,
          slug: productData.brandId.toLowerCase().replace(/\s+/g, '-'),
        });
        await brandRecord.save();
      }

      // Create product directly in database with all fields
      const newProduct = new Product({
        name: productData.name,
        description: productData.description,
        price: productData.price,
        originalPrice: productData.originalPrice || undefined,
        categoryId: categoryRecord._id,
        brandId: brandRecord._id,
        image: productData.image,
        stockQuantity: parseInt(productData.stockQuantity) || 0,
        tags: tags,
        isNew: productData.isNew || false,
        isBestseller: productData.isBestseller || false,
        isOnSale: productData.isOnSale || false,
        isActive: productData.isActive !== false,
        rating: 4.5, // Default rating
      });
      
      await newProduct.save();
      
      console.log('Created product:', newProduct);
      res.status(201).json(newProduct);
    } catch (error) {
      console.error('Create product error:', error);
      res.status(500).json({ message: "Failed to create product", error: error instanceof Error ? error.message : 'Unknown error' });
    }
  });

  app.put("/api/products/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const productData = req.body;
      console.log('Updating product with data:', productData);
      
      // Parse tags if they exist (comma-separated string to array)
      const tags = productData.tags ? productData.tags.split(',').map((tag: string) => tag.trim()).filter((tag: string) => tag.length > 0) : [];
      
      // Find category and brand by their IDs/names
      let categoryRecord = await Category.findOne({ 
        $or: [
          { slug: productData.categoryId },
          { name: productData.categoryId }
        ]
      });
      
      if (!categoryRecord) {
        // Create category if it doesn't exist
        categoryRecord = new Category({
          name: productData.categoryId,
          slug: productData.categoryId.toLowerCase().replace(/\s+/g, '-'),
        });
        await categoryRecord.save();
      }
      
      let brandRecord = await Brand.findOne({ 
        $or: [
          { slug: productData.brandId },
          { name: productData.brandId }
        ]
      });
      
      if (!brandRecord) {
        // Create brand if it doesn't exist
        brandRecord = new Brand({
          name: productData.brandId,
          slug: productData.brandId.toLowerCase().replace(/\s+/g, '-'),
        });
        await brandRecord.save();
      }

      // Update product directly in database with all fields
      const updatedProduct = await Product.findByIdAndUpdate(
        id,
        {
          name: productData.name,
          description: productData.description,
          price: productData.price,
          originalPrice: productData.originalPrice || undefined,
          categoryId: categoryRecord._id,
          brandId: brandRecord._id,
          image: productData.image,
          stockQuantity: parseInt(productData.stockQuantity) || 0,
          tags: tags,
          isNew: productData.isNew || false,
          isBestseller: productData.isBestseller || false,
          isOnSale: productData.isOnSale || false,
          isActive: productData.isActive !== false,
          updatedAt: new Date(),
        },
        { new: true }
      );
      
      if (!updatedProduct) {
        return res.status(404).json({ message: "Product not found" });
      }
      
      console.log('Updated product:', updatedProduct);
      res.json(updatedProduct);
    } catch (error) {
      console.error('Update product error:', error);
      res.status(500).json({ message: "Failed to update product" });
    }
  });

  app.delete("/api/products/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const deletedProduct = await Product.findByIdAndDelete(id);
      if (!deletedProduct) {
        return res.status(404).json({ message: "Product not found" });
      }
      res.json({ message: "Product deleted successfully" });
    } catch (error) {
      console.error('Delete product error:', error);
      res.status(500).json({ message: "Failed to delete product" });
    }
  });

  // Middleware to check admin access
  const requireAdmin = async (req: any, res: any, next: any) => {
    const { userId } = req.body;
    
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    try {
      const user = await User.findById(userId);
      
      if (!user || user.role !== "admin") {
        return res.status(403).json({ message: "Admin access required" });
      }

      req.adminUser = user;
      next();
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  };

  // Authentication Routes
  const registerSchema = z.object({
    username: z.string().min(1, "Username is required"),
    email: z.string().email("Valid email is required").optional(),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(1, "Confirm password is required"),
    firstName: z.string().optional(),
    lastName: z.string().optional(),
    phone: z.string().optional()
  }).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

  const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
  });

  // Register new user
  app.post("/api/auth/register", async (req, res) => {
    try {
      const result = registerSchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ 
          message: "Validation failed", 
          errors: result.error.flatten().fieldErrors 
        });
      }

      const { confirmPassword, ...userData } = result.data;

      // Check if user already exists
      const existingUser = userData.email ? await storage.getUserByEmail(userData.email) : null;
      if (existingUser) {
        return res.status(409).json({ message: "User already exists with this email" });
      }

      // Check if username is taken
      const existingUsername = await storage.getUserByUsername(userData.username);
      if (existingUsername) {
        return res.status(409).json({ message: "Username is already taken" });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(userData.password, 12);

      // Create user
      const user = await storage.createUser({
        ...userData,
        password: hashedPassword,
      });

      // Remove password from response
      const { password, ...userResponse } = user;

      res.status(201).json({ 
        message: "User created successfully", 
        user: userResponse 
      });
    } catch (error) {
      console.error("Registration error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Login user
  app.post("/api/auth/login", async (req, res) => {
    try {
      const result = loginSchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ 
          message: "Validation failed", 
          errors: result.error.flatten().fieldErrors 
        });
      }

      const { email, password } = result.data;

      // Find user by email or username (for admin account)
      let user = await storage.getUserByEmail(email);
      
      // If not found by email, try username (for admin login)
      if (!user) {
        user = await User.findOne({ username: email });
      }
      
      if (!user) {
        return res.status(401).json({ message: "Invalid email or password" });
      }

      // Check password
      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        return res.status(401).json({ message: "Invalid email or password" });
      }

      // Remove password from response
      const { password: _, ...userResponse } = user;

      res.json({ 
        message: "Login successful", 
        user: userResponse 
      });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Get user profile
  app.get("/api/auth/profile/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const user = await storage.getUser(id);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Remove password from response
      const { password, ...userResponse } = user;
      res.json(userResponse);
    } catch (error) {
      console.error("Profile error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Update user profile
  app.patch("/api/auth/profile/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const updateData = req.body;

      // Don't allow password updates through this endpoint
      delete updateData.password;
      delete updateData.id;

      const user = await storage.updateUser(id, updateData);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Remove password from response
      const { password, ...userResponse } = user;
      res.json({ 
        message: "Profile updated successfully", 
        user: userResponse 
      });
    } catch (error) {
      console.error("Profile update error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Admin Routes
  app.post("/api/admin/stats", async (req, res) => {
    try {
      const { userId } = req.body;
      
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const user = await User.findById(userId);
      
      if (!user || user.role !== "admin") {
        return res.status(403).json({ message: "Admin access required" });
      }

      const allUsers = await User.find();
      
      res.json({
        totalUsers: allUsers.length,
        totalOrders: 0,
        totalRevenue: 0,
        totalProducts: 4
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch admin stats" });
    }
  });

  app.post("/api/admin/users", async (req, res) => {
    try {
      const { userId } = req.body;
      
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const user = await User.findById(userId);
      
      if (!user || user.role !== "admin") {
        return res.status(403).json({ message: "Admin access required" });
      }

      const allUsers = await User.find().select('-password');
      res.json(allUsers);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch users" });
    }
  });

  app.delete("/api/admin/users/:userId", async (req, res) => {
    try {
      const { userId: targetUserId } = req.params;
      const { userId } = req.body;
      
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const adminUser = await User.findById(userId);
      
      if (!adminUser || adminUser.role !== "admin") {
        return res.status(403).json({ message: "Admin access required" });
      }

      // Prevent deleting admin account
      const userToDelete = await User.findById(targetUserId);
      if (userToDelete?.role === "admin") {
        return res.status(403).json({ message: "Cannot delete admin account" });
      }

      await User.findByIdAndDelete(targetUserId);
      res.json({ message: "User deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete user" });
    }
  });

  // Image placeholder API
  app.get("/api/placeholder/:width/:height", (req, res) => {
    const { width, height } = req.params;
    const imageUrl = `https://via.placeholder.com/${width}x${height}/26732d/ffffff?text=Pet+Shop`;
    res.redirect(imageUrl);
  });

  const server = createServer(app);
  return server;
}