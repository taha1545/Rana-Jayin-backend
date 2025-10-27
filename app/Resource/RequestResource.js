const dayjs = require('dayjs');

module.exports = (request) => {
    return {
        id: request.id,
        clientId: request.clientId,
        storeId: request.storeId,
        serviceType: request.serviceType || '',
        longitude: request.longitude,
        latitude: request.latitude,
        status: request.status,
        completedAt: request.completedAt ? dayjs(request.completedAt).format('YYYY-MM-DD HH:mm:ss') : null,
        createdAt: request.createdAt ? dayjs(request.createdAt).format('YYYY-MM-DD HH:mm:ss') : null,
    };
};
