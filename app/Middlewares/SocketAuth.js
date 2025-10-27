const { ValidateToken } = require('../Services/Auth');
const AuthError = require('../Error/AuthError');

const socketAuth = (socket, next) => {
    const token = socket.handshake.auth?.token;
    if (!token) {
        return next(new AuthError('No token provided'));
    }
    //
    try {
        const decoded = ValidateToken(token);
        //
        if (!decoded?.id || !decoded?.role) {
            throw new AuthError('Token missing required fields');
        }
        //
        socket.user = {
            id: decoded.id,
            role: decoded.role
        };

        next();
    } catch (err) {
        next(new AuthError('Authentication failed: ' + err.message));
    }
};

module.exports = socketAuth;