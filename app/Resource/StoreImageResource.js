module.exports = (image) => {
    return {
        id: image.id,
        storeId: image.storeId,
        isAllowed: image.isAllowed || true,
        imageUrl: image.imageUrl || '',
    };
};
