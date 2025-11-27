/* * MI6 SECURITY PROTOCOL
 * LEVEL: CLASSIFIED
 * MODULE: AUTHENTICATION CHECKPOINT
 */

require('dotenv').config();

const validateAccess = (req, res, next) => {
    // Het formaat is meestal: "Bearer MI6_SECRET..."
    const authHeader = req.headers['authorization'];
    const secretKey = process.env.API_SECRET_KEY;

    // 2. Geen paspoort? Geen toegang.
    if (!authHeader) {
        console.warn(`INTRUDER ALERT: No credentials provided from IP: ${req.ip}`);
        return res.status(401).json({ message: 'Access Denied. Clearance Level Missing.' });
    }

    // Strip het woord "Bearer " eraf (als het er staat) en check de code
    const token = authHeader.replace('Bearer ', '');

    // 4. Vergelijk met de master key
    if (token !== secretKey) {
        console.warn(`💀 SECURITY BREACH: Invalid credentials used from IP: ${req.ip}`);
        return res.status(403).json({ message: 'Access Denied. Invalid Clearance Code.' });
    }

    // 'next()' vertelt Express om door te gaan naar de Controller.
    next();
};

module.exports = validateAccess;