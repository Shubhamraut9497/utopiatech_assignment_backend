import express, { Router } from 'express';
import { Request, Response } from 'express';
import { LoginUser, deleteUser, registerUser, userProfile } from '../controllers/controller';

const router: Router = express.Router();

router.post("/signup", (req: Request, res: Response) => {
  registerUser(req, res);
});

router.post("/login", (req: Request, res: Response) => {
  LoginUser(req, res);
});

router.delete("/delete/:id", (req: Request, res: Response) => {
  deleteUser(req, res);
});

router.get("/users", (req: Request, res: Response) => {
  userProfile(req, res);
});

export default router;