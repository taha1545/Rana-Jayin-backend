//
module.exports = (fields = []) => {
    return (req, res, next) => {
        try {
            fields.forEach(field => {
                if (req.body[field] && typeof req.body[field] === 'string') {
                    req.body[field] = JSON.parse(req.body[field]);
                }
            });
            next();
        } catch (err) {
            return res.status(400).json({
                success: false,
                errors: [{ message: 'Invalid JSON in fields: ' + fields.join(', ') }]
            });
        }
    };
};
