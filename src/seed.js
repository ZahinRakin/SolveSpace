import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "./models/User.js"; // Adjust the path if needed

dotenv.config();

mongoose.connect("your_mongodb_uri");

const users = [
  {
    "firstname": "John",
    "lastname": "Doe",
    "username": "john_doe",
    "email": "john.doe@example.com",
    "password": "$2b$10$hashedpassword",
    "role": "student",
  },
  {
    "firstname": "Jane",
    "lastname": "Smith",
    "username": "jane_smith",
    "email": "jane.smith@example.com",
    "password": "$2b$10$hashedpassword",
    "role": "student",
  },
  {
    "firstname": "Alice",
    "lastname": "Brown",
    "username": "alice_brown",
    "email": "alice.brown@example.com",
    "password": "$2b$10$hashedpassword",
    "role": "student",
  },
  {
    "firstname": "Bob",
    "lastname": "Johnson",
    "username": "bob_johnson",
    "email": "bob.johnson@example.com",
    "password": "$2b$10$hashedpassword",
    "role": "student",
  },
  {
    "firstname": "Charlie",
    "lastname": "Davis",
    "username": "charlie_davis",
    "email": "charlie.davis@example.com",
    "password": "$2b$10$hashedpassword",
    "role": "student",
  },
  {
    "firstname": "David",
    "lastname": "Evans",
    "username": "david_evans",
    "email": "david.evans@example.com",
    "password": "$2b$10$hashedpassword",
    "role": "student",
  },
  {
    "firstname": "Emma",
    "lastname": "Wilson",
    "username": "emma_wilson",
    "email": "emma.wilson@example.com",
    "password": "$2b$10$hashedpassword",
    "role": "student",
  },
  {
    "firstname": "Frank",
    "lastname": "Thomas",
    "username": "frank_thomas",
    "email": "frank.thomas@example.com",
    "password": "$2b$10$hashedpassword",
    "role": "student",
  },
  {
    "firstname": "Grace",
    "lastname": "White",
    "username": "grace_white",
    "email": "grace.white@example.com",
    "password": "$2b$10$hashedpassword",
    "role": "student",
  },
  {
    "firstname": "Henry",
    "lastname": "Taylor",
    "username": "henry_taylor",
    "email": "henry.taylor@example.com",
    "password": "$2b$10$hashedpassword",
    "role": "student",
  },
  {
    "firstname": "Isaac",
    "lastname": "Moore",
    "username": "isaac_moore",
    "email": "isaac.moore@example.com",
    "password": "$2b$10$hashedpassword",
    "role": "teacher",
  },
  {
    "firstname": "Jack",
    "lastname": "Anderson",
    "username": "jack_anderson",
    "email": "jack.anderson@example.com",
    "password": "$2b$10$hashedpassword",
    "role": "teacher",
  },
  {
    "firstname": "Kelly",
    "lastname": "Martinez",
    "username": "kelly_martinez",
    "email": "kelly.martinez@example.com",
    "password": "$2b$10$hashedpassword",
    "role": "teacher",
  },
  {
    "firstname": "Leo",
    "lastname": "Hernandez",
    "username": "leo_hernandez",
    "email": "leo.hernandez@example.com",
    "password": "$2b$10$hashedpassword",
    "role": "teacher",
  },
  {
    "firstname": "Mia",
    "lastname": "Lopez",
    "username": "mia_lopez",
    "email": "mia.lopez@example.com",
    "password": "$2b$10$hashedpassword",
    "role": "teacher",
  }
];

const seedUsers = async () => {
  try {
    const createdUsers = await Promise.all(users.map(async (userData) => {
      const user = new User(userData);
      user.password = await userSchema.methods.isPasswordCorrect(user.password) ? user.password : await bcrypt.hash(user.password, 10);
      user.refreshToken = user.generateRefreshToken(); // Use your schema method
      return user.save();
    }));

    console.log("Users seeded successfully with refresh tokens.");
  } catch (error) {
    console.error("Error seeding users:", error);
  } finally {
    mongoose.connection.close();
  }
};

seedUsers();
