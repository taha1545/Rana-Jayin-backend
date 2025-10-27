const fs = require("fs");
const path = require("path");

const PUBLIC_FOLDER = path.join(__dirname, "..", "..", "public");
const PFP_FOLDER = path.join(PUBLIC_FOLDER, "pfp");

const handleJsonImage = async (user, newImageData) => {
    if (!newImageData) return;
    // 
    if (!fs.existsSync(PFP_FOLDER)) {
        fs.mkdirSync(PFP_FOLDER, { recursive: true });
    }
    // 
    if (user.imagePath) {
        const oldPath = path.join(__dirname, "..", user.imagePath);
        try {
            if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
        } catch (err) {
            console.error("Failed to delete old image:", err);
        }
    }
    // 
    const filename = `${Date.now()}-${Math.floor(Math.random() * 1e18)}.jpg`;
    const buffer = Buffer.from(newImageData.replace(/^data:image\/\w+;base64,/, ""), "base64");
    const newPath = path.join(PFP_FOLDER, filename);

    fs.writeFileSync(newPath, buffer);
    // 
    user.imagePath = `public/pfp/${filename}`;
    await user.save();
};

module.exports = handleJsonImage;