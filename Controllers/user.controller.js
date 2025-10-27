"use strict";

const handleJsonImage = require("../app/Services/handleJsonImage");
const db = require("../db/models");
const AuthError = require("../app/Error/AuthError");
const NotFoundError = require("../app/Error/NotFoundError");
const UserResource = require("../app/Resource/UserResource");

// 
exports.showAllPaginate = async (req, res) => {
    //
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    //
    const { count, rows } = await db.User.findAndCountAll({
        limit,
        offset,
        order: [["createdAt", "DESC"]],
    });
    const totalPages = Math.ceil(count / limit);
    //
    res.status(200).json({
        success: true,
        data: rows.map(UserResource),
        pagination: {
            total: count,
            page,
            totalPages,
        },
    });
};

//
exports.getUser = async (req, res) => {
    //
    const user = await db.User.findByPk(req.params.id);
    if (!user) throw new NotFoundError("User not found");
    //
    res.status(200).json({
        success: true,
        data: UserResource(user),
    });
};

//
exports.getMe = async (req, res) => {
    //
    const user = await db.User.findByPk(req.user.id);
    if (!user) throw new NotFoundError("User not found");
    //
    res.status(200).json({
        success: true,
        data: UserResource(user),
    });
};

//
exports.updateMe = async (req, res) => {
    //
    const user = await db.User.findByPk(req.user.id);
    if (!user) throw new NotFoundError('User not found');
    //
    const allowedUpdates = ['name', 'phone'];
    allowedUpdates.forEach((field) => {
        if (req.body[field]) user[field] = req.body[field];
    });
    if (req.body.image) {
        await handleJsonImage(user, req.body.image);
    }
    //
    await user.save();
    //
    res.status(200).json({
        success: true,
        message: 'User updated',
        user: UserResource(user)
    });
};

//
exports.deleteUser = async (req, res) => {
    //
    const user = await db.User.findByPk(req.params.id);
    if (!user) throw new NotFoundError("User not found");
    //
    await user.destroy();
    //
    res.status(200).json({
        success: true,
        message: "User deleted successfully",
    });
};
