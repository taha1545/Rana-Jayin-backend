module.exports = (image) => {
    return {
        id: image.id,
        storeId: image.storeId,
        imageUrl: image.imageUrl || '',
    };
};
