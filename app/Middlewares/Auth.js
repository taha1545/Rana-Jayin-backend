const { ValidateToken } = require('../Services/Auth');
const AuthError = require('../Error/AuthError');


const checkAuth = (req, res, next) => {
    //
    const authHeader = req.headers.authorization;
    //
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return next(new AuthError('No token provided'));
    }
    const token = authHeader.split(' ')[1];
    //
    try {
        const decoded = ValidateToken(token);
        if (!decoded?.id || !decoded?.role) {
            throw new AuthError('Token missing required fields');
        }
        //
        req.user = {
            id: decoded.id,
            role: decoded.role
        };
        next();
    } catch (err) {
        next(new AuthError('Authentication failed: ' + err.message));
    }
};

const checkMembre = (req, res, next) => {
    if (!req.user) {
        return next(new AuthError('User not authenticated'));
    }
    //
    if (req.user.role !== 'membre ' && req.user.role !== 'admin') {
        return next(new AuthError('Admin access required'));
    }
    next();
};

const checkAdmin = (req, res, next) => {
    if (!req.user) {
        return next(new AuthError('User not authenticated'));
    }
    //
    if (req.user.role !== 'admin') {
        return next(new AuthError('Admin access required'));
    }
    next();
};

module.exports = {
    checkAuth,
    checkAdmin,
    checkMembre
};
