const ErrorHandler = require('./errorHandler');

// List of allowed IP ranges for Thapar Institute
const ALLOWED_IP_RANGES = [
    // Example IP ranges for Thapar Institute WiFi
    // Replace these with actual IP ranges of your college network
    {
        start: '172.16.0.0',
        end: '172.31.255.255'
    }
];

const isIpInRange = (ip, range) => {
    const ipToLong = (ip) => {
        return ip.split('.')
            .reduce((long, octet) => (long << 8) + parseInt(octet), 0) >>> 0;
    };

    const ipLong = ipToLong(ip);
    const startLong = ipToLong(range.start);
    const endLong = ipToLong(range.end);

    return ipLong >= startLong && ipLong <= endLong;
};

exports.validateThaparEmail = (email) => {
    const emailDomain = email.split('@')[1];
    return emailDomain === 'thapar.edu';
};

exports.validateThaparNetwork = (ip) => {
    return ALLOWED_IP_RANGES.some(range => isIpInRange(ip, range));
}; 