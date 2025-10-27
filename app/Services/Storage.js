const multer = require('multer');
const path = require('path');
const fs = require('fs');
// 
const uploadDir = './public/pfp/';
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}
//
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueName = Date.now() + '-' + path.basename(file.originalname);
        cb(null, uniqueName);
    }
});
// 
function fileFilter(req, file, cb) {
    const allowedExt = /jpeg|jpg|png|gif|heic|heif/;
    const allowedMimeTypes = [
        'image/jpeg',
        'image/jpg',
        'image/png',
        'image/gif',
        'image/heic',
        'image/heif'
    ];
    const ext = path.extname(file.originalname).toLowerCase().slice(1);
    const mime = file.mimetype.toLowerCase();
    //
    if (allowedExt.test(ext) && allowedMimeTypes.includes(mime)) {
        cb(null, true);
    } else {
        const err = new Error('Only image files (jpg, png, gif, heic, heif) are allowed!');
        err.code = 'INVALID_FILE_TYPE';
        cb(err);
    }
}

// 
const upload = multer({ storage, fileFilter });

module.exports = upload;