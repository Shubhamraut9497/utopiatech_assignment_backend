"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const controller_1 = require("../controllers/controller");
const router = express_1.default.Router();
router.post("/signup", (req, res) => {
    (0, controller_1.registerUser)(req, res);
});
router.post("/login", (req, res) => {
    (0, controller_1.LoginUser)(req, res);
});
router.delete("/delete/:id", (req, res) => {
    (0, controller_1.deleteUser)(req, res);
});
router.get("/users", (req, res) => {
    (0, controller_1.userProfile)(req, res);
});
exports.default = router;
