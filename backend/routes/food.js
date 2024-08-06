import express from "express";
import { Foods, Users } from "../db.js";
import zod from "zod";
import authMiddleware from "../middleware.js";
import dotenv from "dotenv";
import nodemailer from "nodemailer";

dotenv.config();

const router = express.Router();

const foodSchema = zod.object({
    foodName: zod.string(),
    foodType: zod.string(),
    foodImage: zod.string().optional(),
    description: zod.string().optional(),
    quantity: zod.number().positive(),
    expiryDate: zod.date(),
    donatedDate: zod.date().default(() => new Date()),
    pickupLocation: zod.string(),
    pickupTime: zod.string(),
    phoneNo: zod.string(),
    note: zod.string().optional(),
});

router.post("/donate", authMiddleware, async (req, res) => {
    try {
        if (req.body.expiryDate) {
            const expiryDate = new Date(req.body.expiryDate);
            expiryDate.setHours(23, 59, 59, 999);
            const offset = 5.5 * 60 * 60 * 1000;
            const expiryDateInIST = new Date(expiryDate.getTime() + offset);
            req.body.expiryDate = expiryDateInIST;
        }

        const validatedData = foodSchema.parse(req.body);
        const userId = req.userId;

        const newFood = new Foods({
            userId,
            ...validatedData,
        });

        await newFood.save();

        const user = await Users.findByIdAndUpdate(
            userId,
            {
                $push: {
                    activities: {
                        action: "active",
                        foodId: newFood._id,
                        timestamp: new Date(),
                    },
                },
            },
            { new: true }
        );

        return res.status(201).json({
            success: true,
            msg: "Food donation successfully recorded",
            data: newFood,
            updated_user: user,
        });
    } catch (error) {
        if (error instanceof zod.ZodError) {
            return res.status(400).json({
                success: false,
                msg: "Validation error",
                errors: error.errors,
            });
        }

        return res.status(500).json({
            success: false,
            msg: "An error occurred while donating food",
            error: error.message,
        });
    }
});

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.SENDER,
        pass: process.env.PASS,
    }
});

router.post("/request/:foodId", authMiddleware, async (req, res) => {
    try {
        const foodId = req.params.foodId;
        const { requestQuantity, requestNote, purpose, ngoNumber } = req.body;
        const userId = req.userId;

        const food = await Foods.findById(foodId);
        if (!food) {
            return res.status(404).json({ success: false, msg: "Food not found" });
        }

        if (food.userId.toString() === userId.toString()) {
            return res.status(400).json({ success: false, msg: "You cannot request food you donated" });
        }

        const donor = await Users.findById(food.userId);
        if (!donor) {
            return res.status(404).json({ success: false, msg: "Donor not found" });
        }

        const donor_mail = donor.email;
        const user = await Users.findById(userId);
        const userMail = user.email;
        const existingActivity = user.activities.find(activity =>
            activity.foodId.toString() === foodId && activity.action === 'requested'
        );

        if (existingActivity) {
            return res.status(400).json({ success: false, msg: "You have already requested this food" });
        }

        const mailOptions = {
            from: process.env.SENDER,
            to: donor_mail,
            subject: 'Food Pickup Request Notification (Blessed Basket)',
            html: `
            <h1>Getter Email ${userMail}</h1>
            <h2>Food Pickup Request Details:</h2>
            <p><strong>Food Name:</strong> ${food.foodName}</p>
            <p><strong>Request Quantity:</strong> ${requestQuantity}</p>
            <p><strong>Request Note:</strong> ${requestNote || 'N/A'}</p>
            <p><strong>Purpose:</strong> ${purpose || 'N/A'}</p>
            <p><strong>NGO Number:</strong> ${ngoNumber || 'N/A'}</p>
            <p>Your food will be picked up today. Thank you for your generosity!</p>
            <p>Please confirm you are ready to deliver the food from the website!</p>
            <p>Sincerely,</p>
            <p>Blessed Baskets</p>
            `,
        };

        transporter.sendMail(mailOptions, async (error, info) => {
            if (error) {
                console.log(error);
                return res.status(500).json({ success: false, msg: "Failed to send email" });
            } else {
                console.log('Email sent: ' + info.response);

                const user = await Users.findById(userId);

                user.activities.push({
                    action: "requested",
                    foodId,
                    timestamp: new Date(),
                });

                await user.save();

                food.isActive = false;
                await food.save();

                return res.status(200).json({
                    success: true,
                    msg: "Successfully sent mail to donor",
                    getter: user,
                    donor
                });
            }
        });
    } catch (e) {
        console.log(e.message);
        return res.status(500).json({
            success: false,
            msg: "An error occurred"
        });
    }
});

router.post("/confirm/:foodId", authMiddleware, async (req, res) => {
    try {
        const getterMail = req.body.getterEmail;

        const getter = await Users.findOne({ email: getterMail });

        if (!getter) {
            return res.status(404).json({ success: false, msg: 'Getter not found' });
        }

        const getterId = getter._id;
        const donorId = req.userId;
        const foodId = req.params.foodId;

        await Users.updateOne(
            { _id: donorId, 'activities.foodId': foodId },
            { $set: { 'activities.$.action': 'delivered' } }
        );

        await Users.updateOne(
            { _id: getterId, 'activities.foodId': foodId },
            { $set: { 'activities.$.action': 'confirmed' } }
        );

        const mailOptions = {
            from: process.env.SENDER,
            to: getterMail,
            subject: 'Food confirmation Notification (Blessed Baskets)',
            html: `
            <p>I am ready to donate my food</p>
            <p>Sincerely,</p>
            <p>Blessed Baskets</p>
            `,
        };

        transporter.sendMail(mailOptions, async (error, info) => {
            if (error) {
                console.log(error);
                return res.status(500).json({ success: false, msg: "Failed to send email" });
            } else {
                console.log('Email sent: ' + info.response);

                const donor = await Users.findById(donorId);
                const newGetter = await Users.findById(getterId);

                res.status(200).json({
                    success: true,
                    msg: 'Activity status updated successfully',
                    donor,
                    getter: newGetter,
                });
            }
        });
    } catch (error) {
        console.error("Error while updating activity status", error);
        res.status(500).json({ success: false, msg: 'An error occurred while updating activity status' });
    }
});

router.get('/allfoods', async (req, res) => {
    try {
        const today = new Date();
        today.setHours(23, 58, 58, 999);
        const offset = 5.5 * 60 * 60 * 1000;
        const todayInIST = new Date(today.getTime() + offset);

        const foods = await Foods.find({ expiryDate: { $gte: todayInIST }, isActive: true });
        return res.status(200).json({
            success: true,
            msg: "Foods retrieved successfully",
            foods
        });
    } catch (error) {
        console.error("error: ", error);
        return res.status(500).json({
            success: false,
            msg: "An error occurred while retrieving foods",
            error: error.message
        });
    }
});

router.get("/detail/:foodId", async (req, res) => {
    try {
        const fid = req.params.foodId;

        const food = await Foods.findById(fid);

        if (!food) {
            return res.status(404).json({
                success: false,
                msg: "Food item not found"
            });
        }

        return res.status(200).json({
            success: true,
            msg: "Food item retrieved successfully",
            food
        });
    } catch (e) {
        return res.status(500).json({
            success: false,
            msg: "Error during finding food item",
            error: e.message
        });
    }
});

export default router;
