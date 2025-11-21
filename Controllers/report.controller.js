"use strict";

const db = require("../db/models");


exports.createReport = async (req, res) => {
    //
    const { description, longitude, latitude } = req.body;
    const imagePath = req.file ? req.file.path : null;
    //
    const report = await db.Report.create({ description, longitude, latitude, imagePath });
    //
    res.status(201).json({
        success: true,
        message: "Report created successfully",
        data: report,
    });
};

exports.getAllReports = async (req, res) => {
    //
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;
    //      
    const { count, rows } = await db.Report.findAndCountAll({
        offset: parseInt(offset),
        limit: parseInt(limit),
        order: [["createdAt", "DESC"]],
    });
    //  
    res.status(200).json({
        success: true,
        message: "Reports retrieved successfully",
        data: {
            total: count,
            page: parseInt(page),
            perPage: parseInt(limit),
            reports: rows,
        },
    });
};