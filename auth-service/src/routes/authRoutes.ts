import { Request, Response, Router } from "express";
import { authenticateUser, authorizeRole } from "../middleware/authMiddleware";
import { loginUser, registerUser } from "../controllers/authController";
import { asyncHandler } from "../middleware/asyncHandler";

const router = Router();

const sendResponse = (res: Response, status: number, success: boolean, message: string, data?: any) => {
  return res.status(status).json({ success, message, data });
};

// Admin Dashboard Route
router.get(
  "/admin-dashboard",
  authenticateUser,
  authorizeRole(["admin"]),
  asyncHandler(async (req: Request, res: Response) => {
    sendResponse(res, 200, true, "Welcome, Admin!");
  })
);

// Manager Dashboard Route
router.get(
  "/manager-dashboard",
  authenticateUser,
  authorizeRole(["manager", "admin"]),
  asyncHandler(async (req: Request, res: Response) => {
    sendResponse(res, 200, true, "Welcome, Manager or Admin!");
  })
);

// User Dashboard Route
router.get(
  "/user-dashboard",
  authenticateUser,
  asyncHandler(async (req: Request, res: Response) => {
    sendResponse(res, 200, true, "Welcome, authenticated user!");
  })
);

// Authentication Routes
router.post("/register", asyncHandler(registerUser));
router.post("/login", asyncHandler(loginUser));

export default router;
