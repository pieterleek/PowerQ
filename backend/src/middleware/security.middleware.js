/* * MI6 SECURITY PROTOCOL - DUAL AUTHENTICATION
 * MODULE: ACCESS CONTROL
 */
require('dotenv').config();

const validateAccess = (req, res, next) => {
    // 1. Haal de token uit de header
    const authHeader = req.headers['authorization'];

    if (!authHeader) {
        return res.status(401).json({ message: 'Access Denied. No Credentials.' });
    }

    // Strip "Bearer " eraf
    const token = authHeader.replace('Bearer ', '');

    // 2. Haal de sleutels uit de kluis
    const agentKey = process.env.AGENT_SECRET;   // Voor ESP32
    const viewerKey = process.env.VIEWER_SECRET; // Voor Frontend

    if (req.method === 'POST') {
        if (token === agentKey) {
            return next(); // Toegang verleend aan Agent
        }
    }

    else if (req.method === 'GET') {
        if (token === viewerKey) {
            return next(); // Toegang verleend aan Viewer
        }
    }

    console.warn(`SECURITY BREACH: Invalid token for ${req.method} from IP: ${req.ip}`);
    return res.status(403).json({ message: 'Access Denied. Wrong Clearance Level.' });
};

module.exports = validateAccess;