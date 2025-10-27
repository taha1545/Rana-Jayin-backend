const db = require("../db/models");
const StoreImageResource = require("../app/Resource/StoreImageResource");
const NotFoundError = require("../app/Error/NotFoundError");
const AppError = require("../app/Error/AppError");

// 
exports.add = async (req, res) => {
    const { storeId } = req.body;
    let imagePath = req.file ? req.file.path : null;
    if (!imagePath) throw new AppError('Image file is required');
    //
    const image = await db.StoreImage.create({
        storeId,
        imageUrl: imagePath,
    });
    //
    res.status(201).json({
        success: true,
        message: 'Image added successfully',
        data: StoreImageResource(image),
    });
};

// 
exports.delete = async (req, res) => {
    const { id } = req.params;
    const image = await db.StoreImage.findByPk(id);
    //
    if (!image) {
        throw new NotFoundError('Image not found', 404);
    }
    //
    await image.destroy();
    //
    res.status(200).json({
        success: true,
        message: 'Image deleted successfully',
        data: { id },
    });
};
