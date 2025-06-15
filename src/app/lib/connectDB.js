import mongoose from 'mongoose';

const connectDB = async () => {
  if (mongoose.connections[0].readyState) return;

  await mongoose.connect("mongodb+srv://ubaidDeveloper:786125@authentication.q1rc0yu.mongodb.net/?retryWrites=true&w=majority&appName=Authentication")
  console.log('MongoDB Connected');
};

export default connectDB;
