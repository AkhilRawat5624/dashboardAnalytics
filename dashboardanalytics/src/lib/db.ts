import mongoose from "mongoose";

const dbconnect = async () => {
  try {
    const uri = process.env.MONGODB_URI;
    if (!uri) {
      throw new Error("MONGODB_URI environment variable is not defined.");
    }

    if (mongoose.connection.readyState >= 1) {
      // Already connected
      return mongoose.connection.asPromise();
    }

    await mongoose.connect(uri, {
      dbName: "dashboardAnalytics", 
    });

    console.log("✅ MongoDB connected successfully");
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error);
    throw error;
  }
};

export default dbconnect;
