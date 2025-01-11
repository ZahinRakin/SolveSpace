import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';

// Load environment variables from .env file to process.env object.
dotenv.config();
// Create an instance of Express
const app = express();

const corsOptions = {
  origin: 'http://localhost:5173', // Match the frontend's origin exactly
  methods: ['GET', 'POST'],       // Specify allowed methods
  allowedHeaders: ['Content-Type'], // Specify allowed headers
};

app.use(cors(corsOptions));



// Use middleware to parse JSON data
app.use(express.json());

// MongoDB connection
const dbURI = process.env.MONGO_URI;

if (!dbURI) {
  console.error('MONGO_URI is undefined!');
  process.exit(1); // Exit the application if the URI is not defined
}

mongoose.connect(dbURI)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

  
// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Example route
app.post('/', (req, res) => {
  const { name, age } = req.body;
  console.log(`name: ${name}, age: ${age}`);
  res.json({message: 'data received'});
})
