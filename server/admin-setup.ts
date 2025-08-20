import bcrypt from "bcrypt";
import { db } from "./db";
import { users, brands } from "@shared/schema";
import { eq } from "drizzle-orm";

export async function createAdminAccount() {
  try {
    // Check if admin account already exists by email
    const existingAdmin = await db.select().from(users).where(eq(users.email, "admin@gmail.com")).limit(1);

    if (existingAdmin.length > 0) {
      console.log("Admin account already exists");
      return;
    }

    // Hash the admin password
    const hashedPassword = await bcrypt.hash("meowmeow123", 10);

    // Create the admin account with email
    await db.insert(users).values({
      username: "admin",
      password: hashedPassword,
      email: "admin@gmail.com",
      firstName: "System",
      lastName: "Administrator",
      role: "admin",
      isActive: true,
    });

    console.log("Admin account created successfully: admin@gmail.com");

    // Create default brands
    const brandData = [
      { name: 'Nekko', slug: 'nekko', description: 'Premium cat food brand from Thailand' },
      { name: 'Purina', slug: 'purina', description: 'Trusted pet nutrition for over 90 years' },
      { name: 'Purina One', slug: 'purina-one', description: 'Purposeful nutrition for dogs and cats' },
      { name: 'Reflex', slug: 'reflex', description: 'Complete nutrition for pets' },
      { name: 'Reflex Plus', slug: 'reflex-plus', description: 'Enhanced nutrition with premium ingredients' },
      { name: 'Royal Canin', slug: 'royal-canin', description: 'Breed-specific and life-stage nutrition' },
      { name: 'Sheba', slug: 'sheba', description: 'Gourmet cat food with fine cuts' }
    ];

    for (const brand of brandData) {
      const existingBrand = await db.select().from(brands).where(eq(brands.slug, brand.slug)).limit(1);
      if (existingBrand.length === 0) {
        await db.insert(brands).values(brand);
        console.log(`Created brand: ${brand.name}`);
      }
    }

  } catch (error) {
    console.error("Error creating admin account:", error);
  }
}