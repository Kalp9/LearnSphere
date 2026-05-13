import mongoose from "mongoose";

const connectDB = async () => {
  let mongoUri = process.env.MONGO_URI;

  if (!mongoUri) {
    const { MongoMemoryServer } = await import("mongodb-memory-server");
    const memoryServer = await MongoMemoryServer.create();
    mongoUri = memoryServer.getUri();
    global.__learnsphereMemoryMongo = memoryServer;
    console.warn("MONGO_URI missing. Using in-memory MongoDB for this development session.");
  }

  mongoose.set("strictQuery", true);
  const conn = await mongoose.connect(mongoUri);
  console.log(`MongoDB connected: ${conn.connection.host}`);
};

export default connectDB;
