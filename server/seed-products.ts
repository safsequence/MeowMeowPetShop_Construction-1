
import { Product, Category, Brand } from "@shared/models";

export async function seedDummyProducts() {
  try {
    console.log('Starting to seed dummy products...');

    // Get existing categories and brands
    const categories = await Category.find();
    const brands = await Brand.find();

    if (categories.length === 0 || brands.length === 0) {
      console.log('No categories or brands found. Please create them first.');
      return;
    }

    const dummyProducts = [
      {
        name: "Premium Chicken & Rice Cat Food",
        description: "High-quality dry cat food with real chicken as the first ingredient. Perfect for adult cats with sensitive stomachs.",
        price: 2800,
        originalPrice: 3200,
        image: "https://images.unsplash.com/photo-1589924691995-400dc9ecc119?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
        stockQuantity: 45,
        tags: ["premium", "chicken", "adult"],
        isNew: false,
        isBestseller: true,
        isOnSale: true,
        isActive: true,
        rating: 4.8
      },
      {
        name: "Organic Salmon Wet Cat Food (12 Pack)",
        description: "Delicious organic salmon wet food in convenient serving sizes. Rich in omega-3 fatty acids for healthy coat.",
        price: 1850,
        image: "https://images.unsplash.com/photo-1574158622682-e40e69881006?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
        stockQuantity: 78,
        tags: ["organic", "salmon", "wet food"],
        isNew: true,
        isBestseller: false,
        isOnSale: false,
        isActive: true,
        rating: 4.6
      },
      {
        name: "Large Breed Puppy Food",
        description: "Specially formulated nutrition for large breed puppies. Supports healthy bone and joint development.",
        price: 4200,
        originalPrice: 4800,
        image: "https://images.unsplash.com/photo-1552053628-0dcb5a60e3de?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
        stockQuantity: 32,
        tags: ["puppy", "large breed", "development"],
        isNew: false,
        isBestseller: true,
        isOnSale: true,
        isActive: true,
        rating: 4.9
      },
      {
        name: "Interactive Puzzle Feeder Bowl",
        description: "Slow feeding bowl that promotes healthy eating habits and mental stimulation for dogs and cats.",
        price: 1200,
        image: "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
        stockQuantity: 67,
        tags: ["interactive", "puzzle", "slow feeding"],
        isNew: true,
        isBestseller: false,
        isOnSale: false,
        isActive: true,
        rating: 4.4
      },
      {
        name: "Natural Clumping Cat Litter (10kg)",
        description: "Eco-friendly clumping cat litter made from natural clay. Superior odor control and easy cleanup.",
        price: 980,
        originalPrice: 1200,
        image: "https://images.unsplash.com/photo-1518717758536-85ae29035b6d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
        stockQuantity: 89,
        tags: ["natural", "clumping", "odor control"],
        isNew: false,
        isBestseller: true,
        isOnSale: true,
        isActive: true,
        rating: 4.7
      },
      {
        name: "Adjustable Dog Harness - Medium",
        description: "Comfortable and secure harness with reflective strips. Perfect for daily walks and training sessions.",
        price: 1650,
        image: "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
        stockQuantity: 23,
        tags: ["harness", "adjustable", "reflective"],
        isNew: true,
        isBestseller: false,
        isOnSale: false,
        isActive: true,
        rating: 4.5
      },
      {
        name: "Dental Chew Treats for Dogs (50 pieces)",
        description: "Helps maintain oral health while providing a tasty treat. Reduces tartar and freshens breath naturally.",
        price: 750,
        image: "https://images.unsplash.com/photo-1605043204319-d14e5ba4719e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
        stockQuantity: 156,
        tags: ["dental", "treats", "oral health"],
        isNew: false,
        isBestseller: true,
        isOnSale: false,
        isActive: true,
        rating: 4.6
      },
      {
        name: "Multi-Level Cat Tree with Scratching Posts",
        description: "Large cat tree with multiple levels, cozy hideouts, and sisal scratching posts. Perfect for active cats.",
        price: 8900,
        originalPrice: 10500,
        image: "https://images.unsplash.com/photo-1615789591457-74a63395c990?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
        stockQuantity: 12,
        tags: ["cat tree", "scratching", "multi-level"],
        isNew: true,
        isBestseller: false,
        isOnSale: true,
        isActive: true,
        rating: 4.8
      },
      {
        name: "Automatic Pet Water Fountain",
        description: "Encourages pets to drink more water with flowing fountain design. Includes replaceable filters for clean water.",
        price: 3400,
        image: "https://images.unsplash.com/photo-1628009368231-7bb7cfcb0def?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
        stockQuantity: 41,
        tags: ["automatic", "water fountain", "hydration"],
        isNew: true,
        isBestseller: true,
        isOnSale: false,
        isActive: true,
        rating: 4.7
      },
      {
        name: "Professional Pet Grooming Kit",
        description: "Complete grooming set with brushes, nail clippers, and scissors. Everything needed for at-home grooming.",
        price: 2300,
        originalPrice: 2800,
        image: "https://images.unsplash.com/photo-1631044402983-80c4a0c49b5d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
        stockQuantity: 34,
        tags: ["grooming", "professional", "complete kit"],
        isNew: false,
        isBestseller: false,
        isOnSale: true,
        isActive: true,
        rating: 4.5
      }
    ];

    let createdCount = 0;

    for (const productData of dummyProducts) {
      try {
        // Check if product already exists
        const existingProduct = await Product.findOne({ name: productData.name });
        if (existingProduct) {
          console.log(`Product "${productData.name}" already exists, skipping...`);
          continue;
        }

        // Assign random category and brand
        const randomCategory = categories[Math.floor(Math.random() * categories.length)];
        const randomBrand = brands[Math.floor(Math.random() * brands.length)];

        const newProduct = new Product({
          ...productData,
          categoryId: randomCategory._id,
          brandId: randomBrand._id,
        });

        await newProduct.save();
        createdCount++;
        console.log(`Created product: ${productData.name}`);
      } catch (error) {
        console.error(`Error creating product "${productData.name}":`, error);
      }
    }

    console.log(`Successfully created ${createdCount} dummy products!`);
    return createdCount;
  } catch (error) {
    console.error('Error seeding dummy products:', error);
    throw error;
  }
}
