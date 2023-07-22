import bcrypt from "bcryptjs";
import { Request, Response } from "express";
import UserModel from "../models/users";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import crypto from "crypto";

dotenv.config();

const SECRET_KEY = process.env.SECRET_KEY as string;
const ACCESS_TOKEN_EXPIRY: string = "120s";

export const registerUser = async (req: Request, res: Response) => {
  try {
    console.log(req.body);
    const salt = bcrypt.genSaltSync(10);
    const { email, password } = req.body;
    const hashPassword = await bcrypt.hash(password, salt);
    const user = await UserModel.create({
      email: email,
      password: hashPassword,
    });
    res.status(200).json(user);
  } catch (err) {
    res.status(400).json(err);
    console.log(err);
  }
};

export const LoginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const userDoc = await UserModel.findOne({ email });
    if (!userDoc) {
      return res.status(404).json({ message: "User not found" });
    }
    const passOk = bcrypt.compareSync(password, userDoc.password);
    if (passOk) {
      const accessToken = jwt.sign({ email, id: userDoc._id }, SECRET_KEY, {
        expiresIn: ACCESS_TOKEN_EXPIRY,
      });
      const refreshToken = await generateRefreshToken();

      res.cookie("refreshToken", refreshToken, { httpOnly: true });

      res.json({
        accessToken,
        id: userDoc._id,
        email,
      });
    } else {
      res.status(401).json({ message: "Wrong credentials" });
    }
  } catch (err) {
    res.status(400).json(err);
    console.log(err);
  }
};

function generateRefreshToken() {
  return new Promise<string>((resolve, reject) => {
    crypto.randomBytes(64, (err, buffer) => {
      if (err) {
        reject(err);
      }
      const refreshToken = buffer.toString("hex");
      resolve(refreshToken);
    });
  });
}

export const userProfile = async (req: Request, res: Response) => {
  try {
    const users = await UserModel.find({});

    if (users.length === 0) {
      return res.status(404).json({ message: "No users found" });
    }

    res.status(200).json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    console.log(id);
    const user = await UserModel.findByIdAndDelete(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "User deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};