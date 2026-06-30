import mongoose from "mongoose";

const uri = "mongodb+srv://Prateek:OlRw9NVC1zG4rNOa@clusterone.jxcodtj.mongodb.net/?retryWrites=true&w=majority&appName=ClusterOne";

const connectDB = async () => {
  try {
    await mongoose.connect(uri , {
      dbName : "Expense_tracker"
    });
    console.log("✅ MongoDB connected successfully");
  } catch (error) {
    console.error("❌ MongoDB connection error:", error);
  }
};

export default connectDB;
