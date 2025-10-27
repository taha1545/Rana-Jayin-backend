"use strict";

const bcrypt = require("bcrypt");
const db = require("../db/models");
const { CreateToken } = require("../app/Services/Auth");

const AppError = require("../app/Error/AppError");
const AuthError = require("../app/Error/AuthError");
const NotFoundError = require("../app/Error/NotFoundError");
const UserResource = require("../app/Resource/UserResource");
const StoreImageResource = require("../app/Resource/StoreImageResource");
const PaymentResource = require("../app/Resource/PaymentResource");
const dayjs = require("dayjs");

exports.signupClient = async (req, res) => {
    //
    const { name, phone, password } = req.body;
    const imagePath = req.file ? req.file.path : null;
    const hashedPassword = await bcrypt.hash(password, 10);
    //
    const user = await db.User.create({
        name,
        phone,
        password: hashedPassword,
        imagePath,
        role: "client",
        isVerified: false,
    });
    //
    const token = CreateToken({ id: user.id, role: user.role });
    //
    res.status(201).json({
        success: true,
        message: "Client account created successfully",
        data: {
            user: UserResource(user),
            token,
        },
    });
};

// 
exports.signupMembre = async (req, res) => {
    const t = await db.sequelize.transaction();
    try {
        const {
            name,
            phone,
            password,
            storeName,
            type,
            description,
            latitude,
            longitude,
            priceRange,
        } = req.body;
        // Handle files
        const certificate = req.files?.certificate
            ? req.files.certificate[0].path
            : null;
        const storeImages = req.files?.storeImages?.map(file => file.path) || [];
        // 1️⃣ Create user
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await db.User.create(
            {
                name,
                phone,
                password: hashedPassword,
                role: "member",
                isVerified: false,
            },
            { transaction: t }
        );
        // 2️⃣ Create store
        const store = await db.Store.create(
            {
                userId: user.id,
                name: storeName,
                type,
                description,
                latitude,
                longitude,
                certificate,
                priceRange,
                isActive: false,
            },
            { transaction: t }
        );
        // 3️⃣ Create store images
        const createdImages = [];
        for (const imageUrl of storeImages) {
            const img = await db.StoreImage.create(
                { storeId: store.id, imageUrl },
                { transaction: t }
            );
            createdImages.push(img);
        }
        // 4️⃣ Create free payment (1 month)
        const startDate = dayjs().toDate();
        const endDate = dayjs().add(1, "month").toDate();
        //
        const payment = await db.Payment.create(
            {
                userId: user.id,
                price: 0,
                method: "other",
                status: "completed",
                startDate,
                endDate,
            },
            { transaction: t }
        );
        await t.commit();
        // Generate JWT
        const token = CreateToken({ id: user.id, role: user.role });
        // Response
        res.status(201).json({
            success: true,
            message: "Membre, store, images, and free subscription created successfully",
            data: {
                user: UserResource(user),
                store: {
                    id: store.id,
                    name: store.name,
                    type: store.type,
                    description: store.description,
                    latitude: store.latitude,
                    longitude: store.longitude,
                    isActive: store.isActive,
                    images: createdImages.map(StoreImageResource),
                },
                payment: PaymentResource(payment),
                token,
            },
        });
    } catch (err) {
        await t.rollback();
        throw err;
    }
};

exports.login = async (req, res) => {
    //
    const { phone, password } = req.body;
    //
    const user = await db.User.findOne({ where: { phone } });
    if (!user) throw new AuthError("Invalid phone or password");
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new AuthError("Invalid phone or password");
    //
    const token = CreateToken({ id: user.id, role: user.role });
    //
    res.status(200).json({
        success: true,
        message: "Login successful",
        data: {
            token,
            user: UserResource(user),
        },
    });
};

//
exports.updatePassword = async (req, res) => {
    //
    const { oldPassword, newPassword } = req.body;
    //
    const user = await db.User.findByPk(req.user.id);
    if (!user) throw new NotFoundError("User not found");
    //
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) throw new AuthError("Old password is incorrect");
    //
    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();
    //
    res.status(200).json({
        success: true,
        message: "Password updated successfully",
    });
};


