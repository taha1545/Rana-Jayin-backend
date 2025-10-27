"use strict";

const db = require("../db/models");
const ContactResource = require("../app/Resource/ContactResource");
const NotFoundError = require("../app/Error/NotFoundError");
const AppError = require("../app/Error/AppError");

//
exports.getAllContacts = async (req, res) => {
    //
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;
    //
    const { count, rows } = await db.Contact.findAndCountAll({
        offset: parseInt(offset),
        limit: parseInt(limit),
        order: [["createdAt", "DESC"]],
    });
    //  
    res.status(200).json({
        success: true,
        message: "Contacts retrieved successfully",
        data: {
            total: count,
            page: parseInt(page),
            perPage: parseInt(limit),
            contacts: rows.map(ContactResource),
        },
    });
};

// 
exports.createContact = async (req, res) => {
    //
    const { name, email, message } = req.body;
    //
    const contact = await db.Contact.create({ name, email, message });
    //
    res.status(201).json({
        success: true,
        message: "Contact created successfully",
        data: ContactResource(contact),
    });
};

//
exports.deleteContact = async (req, res) => {
    const { id } = req.params;
    const contact = await db.Contact.findByPk(id);
    //
    if (!contact) throw new NotFoundError("Contact not found");
    //
    await contact.destroy();
    //
    res.status(200).json({
        success: true,
        message: "Contact deleted successfully",
    });
};
