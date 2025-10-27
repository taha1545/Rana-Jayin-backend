const { body } = require("express-validator");
const db = require("../../db/models");
//
const AllTypeServices = [
    "onSiteRepair",
    "towingService",
    "batteryBoost",
    "emergencySupport",
    "fuelDelivery",
    "safetyCheck",
    "accidentAssistance",
    "quickResponse",
];
//
const checkPhoneExists = async (phone) => {
    return await db.User.findOne({ where: { phone } });
};

// 
const loginValidation = [
    body("phone")
        .notEmpty().withMessage("Please enter your phone number.")
        .custom(async (phone) => {
            const user = await checkPhoneExists(phone);
            if (!user) throw new Error("No account found with this phone number.");
        }),
    body("password")
        .notEmpty().withMessage("Please enter your password."),
];

// 
const signupValidationClient = [
    body("name")
        .notEmpty().withMessage("Please enter your name."),
    body("phone")
        .notEmpty().withMessage("Please enter your phone number.")
        .custom(async (phone) => {
            const user = await checkPhoneExists(phone);
            if (user) throw new Error("This phone number is already registered.");
        }),
    body("password")
        .isLength({ min: 6 })
        .withMessage("Password must have at least 6 characters."),
];

// 
const signupValidationMembre = [
    // 🧍 Membre info
    body("name")
        .notEmpty()
        .withMessage("Please enter your name."),

    body("phone")
        .notEmpty()
        .withMessage("Please enter your phone number.")
        .custom(async (phone) => {
            const user = await checkPhoneExists(phone);
            if (user) throw new Error("This phone number is already registered.");
        }),

    body("password")
        .isLength({ min: 6 })
        .withMessage("Password must have at least 6 characters."),

    // 🏪 Store info
    body("storeName")
        .notEmpty()
        .withMessage("Please enter your store name."),

    body("type")
        .notEmpty()
        .withMessage("Please select your store type.")
        .isIn(AllTypeServices)
        .withMessage("Invalid store type selected."),

    body("description")
        .optional()
        .isString()
        .withMessage("Please enter a valid description."),

    body("latitude")
        .optional()
        .isFloat()
        .withMessage("Please provide a valid latitude."),

    body("longitude")
        .optional()
        .isFloat()
        .withMessage("Please provide a valid longitude."),

    body("priceRange")
        .optional()
        .isString()
        .withMessage("Please enter your store price range."),
];


// 
const resetPasswordValidation = [
    body("phone")
        .notEmpty().withMessage("Please enter your phone number.")
        .custom(async (phone) => {
            const user = await checkPhoneExists(phone);
            if (!user) throw new Error("No account found with this phone number.");
        }),
    body("otp").notEmpty().withMessage("Please enter your verification code."),
    body("password")
        .isLength({ min: 6 })
        .withMessage("Password must have at least 6 characters."),
];

// 
const updatePasswordValidation = [
    body("oldPassword").notEmpty().withMessage("Please enter your current password."),
    body("newPassword")
        .isLength({ min: 6 })
        .withMessage("New password must have at least 6 characters."),
];

// 
const updateUserValidation = [
    body("name")
        .optional()
        .notEmpty()
        .withMessage("Name cannot be empty."),
    body("phone")
        .optional()
        .custom(async (phone, { req }) => {
            const userId = req.user?.id;
            const user = await checkPhoneExists(phone);
            if (user && user.id !== userId) throw new Error("This phone number is already used.");
        }),
];

module.exports = {
    loginValidation,
    signupValidationClient,
    signupValidationMembre,
    resetPasswordValidation,
    updatePasswordValidation,
    updateUserValidation,
};
