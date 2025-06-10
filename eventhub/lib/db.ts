import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const dbConnect = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI!, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    const connection = mongoose.connection;
    
    connection.on('connected', () => {
      console.log('MongoDB connected successfully');
    });

    connection.on('error', (err) => {
      console.log(
        'MongoDB connection error. Please make sure MongoDB is running. ' + err
      );
      process.exit();
    });
  } catch (error) {
    console.log('Something went wrong!');
    console.log(error);
  }
};

export default dbConnect;