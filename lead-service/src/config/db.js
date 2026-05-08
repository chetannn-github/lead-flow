import mongoose from 'mongoose';
import config from './env.js';

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(config.mongoURI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    
    mongoose.connection.on('error', (err) => {
      console.error(`MongoDB Runtime Error: ${err}`);
    });

    mongoose.connection.on('disconnected', () => {
      console.warn('MongoDB Disconnected. Trying to reconnect...');
    });

  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;