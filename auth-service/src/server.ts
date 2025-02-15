import express from "express";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes";
import { connectDB, sequelize } from "./config/database";
import { seedRoles } from "./config/seed";

dotenv.config();

const app = express();
app.use(express.json());

app.use("/api/auth", authRoutes);

const PORT = process.env.PORT || 5001;

(async () => {
  try {
    await connectDB();
    await sequelize.sync({ alter: true });
    console.log("Database synced successfully.");
    if(process.env.NODE_ENV != 'production') {
      await seedRoles();
    }
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  } catch (error) {
    console.error("Failed to start the server:", error);
  }
})();