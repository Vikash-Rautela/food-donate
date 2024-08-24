import  Users  from "../models/User.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import dotenv from 'dotenv';
import { signupSchema, signinSchema } from "../validations/authValidation.js";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

export const signupController = async (req, res) => {
    try {
        const parseResult = signupSchema.safeParse(req.body);
        if (!parseResult.success) {
            return res.status(400).json({
                success: false,
                msg: "Incorrect inputs",
                errors: parseResult.error.errors,
            });
        }

        const existingUser = await Users.findOne({ email: req.body.email });
        if (existingUser) {
            return res.status(400).json({ success: false, msg: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const user = await Users.create({
            name: req.body.name,
            email: req.body.email,
            gender: req.body.gender,
            contact: req.body.contact,
            address: req.body.address,
            password: hashedPassword,
        });

        const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '3d' });

        return res.status(201).json({
            success: true,
            msg: "User created successfully",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                gender: user.gender,
                contact: user.contact,
                address: user.address
            },
            token,
        });
    } catch (error) {
        return res.status(500).json({ success: false, msg: "Error during signup" });
    }
};

export const signinController = async (req, res) => {
    try {
        const parseResult = signinSchema.safeParse(req.body);
        if (!parseResult.success) {
            return res.status(400).json({ success: false, msg: "Invalid input fields" });
        }

        const user = await Users.findOne({ email: req.body.email });
        if (!user || !(await bcrypt.compare(req.body.password, user.password))) {
            return res.status(400).json({ success: false, msg: "Incorrect email or password" });
        }

        const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '3d' });

        return res.status(200).json({
            success: true,
            msg: "User logged in successfully",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                gender: user.gender,
                contact: user.contact,
                address: user.address
            },
            token,
        });

    } catch (error) {
        return res.status(500).json({ success: false, msg: "Error during signin" });
    }
};

export const getUserController = async (req, res) => {
    try {
        const { userId } = req.params;

        if (!userId) {
            return res.status(400).json({
                success: false,
                msg: "User ID is required"
            });
        }

        const user = await Users.findById(userId);

        if (!user) {
            return res.status(404).json({
                success: false,
                msg: "User not found"
            });
        }

        return res.status(200).json({
            success: true,
            msg: "User details fetched successfully",
            user
        });
    } catch (e) {
        return res.status(500).json({
            success: false,
            msg: "Error during finding user",
            error: e.message
        });
    }
};
