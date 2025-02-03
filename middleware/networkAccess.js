const ErrorHandler = require('../utils/errorHandler');
const { validateThaparNetwork } = require('../utils/validator');

// Add this at the top of the file for development
const isDevelopment = process.env.NODE_ENV === 'development';

const restrictToThaparNetwork = (req, res, next) => {
    // Skip check in development
    if (isDevelopment) {
        return next();
    }

    // Get client's IP address
    const clientIP = req.ip || 
                    req.connection.remoteAddress || 
                    req.socket.remoteAddress || 
                    req.connection.socket.remoteAddress;

    // Check if IP is in allowed range
    if (!validateThaparNetwork(clientIP)) {
        return next(new ErrorHandler('Access restricted to Thapar Institute network only', 403));
    }

    next();
};

module.exports = restrictToThaparNetwork; 