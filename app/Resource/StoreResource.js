const dayjs = require('dayjs');

module.exports = (store) => {
    return {
        id: store.id,
        userId: store.userId,
        storeName: store.name || '',
        type: store.type || {},
        car: store.car || {},
        description: store.description || '',
        latitude: store.latitude,
        longitude: store.longitude,
        isActive: store.isActive,
        certificatePath: store.certificate || '',
        priceRange: store.priceRange || '',
        createdAt: store.createdAt ? dayjs(store.createdAt).format('YYYY-MM-DD HH:mm:ss') : null,
    };
};
