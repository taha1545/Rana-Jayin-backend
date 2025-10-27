module.exports = (review) => {
    return {
        id: review.id,
        storeId: review.storeId,
        clientId: review.clientId,
        rating: review.rating,
        comment: review.comment || '',
        createdAt: review.createdAt,
    };
};
