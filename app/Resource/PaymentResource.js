const dayjs = require('dayjs');

module.exports = (payment) => {
    return {
        id: payment.id,
        userId: payment.userId,
        price: payment.price,
        method: payment.method,
        status: payment.status,
        startDate: payment.startDate ? dayjs(payment.startDate).format('YYYY-MM-DD HH:mm:ss') : null,
        endDate: payment.endDate ? dayjs(payment.endDate).format('YYYY-MM-DD HH:mm:ss') : null,
        createdAt: payment.createdAt ? dayjs(payment.createdAt).format('YYYY-MM-DD HH:mm:ss') : null,
    };
};
