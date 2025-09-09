import mongoose from 'mongoose';

let isConnected: boolean = false;

export const connectToDatabase = async () => {
  mongoose.set('strictQuery', true);

  if (!process.env.MONGODB_URL) {
    return console.log('MISSING MONGODB_URL');
  }

  if (isConnected) {
    return;
  }

  try {
    const mongooseOptions: any = {};
    if (process.env.MONGODB_DB_NAME) {
      mongooseOptions.dbName = process.env.MONGODB_DB_NAME;
    }
    const conn = await mongoose.connect(process.env.MONGODB_URL, mongooseOptions);

    isConnected = true;
    console.log('MongoDB is connected to', conn.connection.name);
  } catch (error) {
    console.log('MongoDB connection failed', error);
  }
};
