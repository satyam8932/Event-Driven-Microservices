import { Request, Router } from "express";
import { authenticateUser } from "../middleware/authMiddleware";
import { authorizeRole } from "../middleware/authMiddleware";

const router = Router();

router.get("/admin-dashboard", authenticateUser, authorizeRole(["admin"]), (req, res) => {
  res.json({ message: "Welcome, Admin!" });
});

router.get("/manager-dashboard", authenticateUser, authorizeRole(["manager", "admin"]), (req, res) => {
  res.json({ message: "Welcome, Manager or Admin!" });
});

router.get("/user-profile", authenticateUser, (req: Request, res) => {
  res.json({ message: "Welcome, authenticated user!" });
});

export default router;
