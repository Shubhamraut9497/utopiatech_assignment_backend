"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUser = exports.userProfile = exports.LoginUser = exports.registerUser = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const users_1 = __importDefault(require("../models/users"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
const crypto_1 = __importDefault(require("crypto"));
dotenv_1.default.config();
const SECRET_KEY = process.env.SECRET_KEY;
const ACCESS_TOKEN_EXPIRY = "120s";
const registerUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log(req.body);
        const salt = bcryptjs_1.default.genSaltSync(10);
        const { email, password } = req.body;
        const hashPassword = yield bcryptjs_1.default.hash(password, salt);
        const user = yield users_1.default.create({
            email: email,
            password: hashPassword,
        });
        res.status(200).json(user);
    }
    catch (err) {
        res.status(400).json(err);
        console.log(err);
    }
});
exports.registerUser = registerUser;
const LoginUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        const userDoc = yield users_1.default.findOne({ email });
        if (!userDoc) {
            return res.status(404).json({ message: "User not found" });
        }
        const passOk = bcryptjs_1.default.compareSync(password, userDoc.password);
        if (passOk) {
            const accessToken = jsonwebtoken_1.default.sign({ email, id: userDoc._id }, SECRET_KEY, {
                expiresIn: ACCESS_TOKEN_EXPIRY,
            });
            const refreshToken = yield generateRefreshToken();
            res.cookie("refreshToken", refreshToken, { httpOnly: true });
            res.json({
                accessToken,
                id: userDoc._id,
                email,
            });
        }
        else {
            res.status(401).json({ message: "Wrong credentials" });
        }
    }
    catch (err) {
        res.status(400).json(err);
        console.log(err);
    }
});
exports.LoginUser = LoginUser;
function generateRefreshToken() {
    return new Promise((resolve, reject) => {
        crypto_1.default.randomBytes(64, (err, buffer) => {
            if (err) {
                reject(err);
            }
            const refreshToken = buffer.toString("hex");
            resolve(refreshToken);
        });
    });
}
const userProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield users_1.default.find({});
        if (users.length === 0) {
            return res.status(404).json({ message: "No users found" });
        }
        res.status(200).json(users);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.userProfile = userProfile;
const deleteUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        console.log(id);
        const user = yield users_1.default.findByIdAndDelete(id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json({ message: "User deleted successfully" });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server Error" });
    }
});
exports.deleteUser = deleteUser;
