
const dayjs = require('dayjs');

module.exports = (user) => {
    return {
        id: user.id,
        name: user.name,
        phone: user.phone || '',
        role: user.role,
        imagePath: user.imagePath || '',
        isVerified: user.isVerified,
        createdAt: user.createdAt ? dayjs(user.createdAt).format('YYYY-MM-DD HH:mm:ss') : null,
    };
};