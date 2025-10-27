module.exports = {
    calculateAverageRating : (reviews) => {
        if (!reviews || reviews.length === 0) return 0;
        const sum = reviews.reduce((acc, r) => acc + (r.rating || 0), 0);
        return parseFloat((sum / reviews.length).toFixed(1));
    }
} 