import dotenv from "dotenv";
import app from "./app.js";
import connectDB from "./config/db.js";
import ensureSeedData from "./utils/ensureSeedData.js";

dotenv.config();

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();
    await ensureSeedData();
    app.listen(PORT, () => {
      console.log(`LearnSphere API running on port ${PORT}`);
    });
  } catch (error) {
    console.error(`Server startup failed: ${error.message}`);
    process.exit(1);
  }
};

startServer();
