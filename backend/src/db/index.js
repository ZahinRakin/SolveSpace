import mongooose from 'mongoose';
import { DB_NAME } from '../constants.js';

async function connectDB() {
  try {
    const connectionInstance = await mongooose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
    console.log('MongoDB connected\n', connectionInstance.connection.host); 
  } catch (error) {
    console.error('MongoDB connection failed', error);
    process.exit(1);
  }
}

export default connectDB;