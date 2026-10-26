import jwt from 'jsonwebtoken';
const JWT_SECRET = process.env.JWT_SECRET || 'ar-green-garden-secret-jwt-key-2026-production-ready';
/**
 * Middleware: Verify JWT token from Authorization header or cookie
 * Attaches decoded user to req.user
 */
export function authenticate(req, res, next) {
    try {
        // Support both Bearer token (Authorization header) and cookie
        let token;
        const authHeader = req.headers.authorization;
        if (authHeader && authHeader.startsWith('Bearer ')) {
            token = authHeader.substring(7);
        }
        else if (req.cookies?.gg_auth_token) {
            token = req.cookies.gg_auth_token;
        }
        if (!token) {
            res.status(401).json({ error: 'Authentication required. Please login.' });
            return;
        }
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    }
    catch (err) {
        res.status(401).json({ error: 'Invalid or expired token. Please login again.' });
    }
}
/**
 * Middleware: Require ADMIN or EDITOR role
 */
export function requireAdmin(req, res, next) {
    if (!req.user) {
        res.status(401).json({ error: 'Authentication required.' });
        return;
    }
    const role = req.user.role?.toUpperCase();
    if (role !== 'ADMIN' && role !== 'EDITOR') {
        res.status(403).json({ error: 'Access denied. Admin privileges required.' });
        return;
    }
    next();
}
/**
 * Middleware: Require ADMIN, EDITOR, or MODERATOR role
 */
export function requireModerator(req, res, next) {
    if (!req.user) {
        res.status(401).json({ error: 'Authentication required.' });
        return;
    }
    const role = req.user.role?.toUpperCase();
    if (role !== 'ADMIN' && role !== 'EDITOR' && role !== 'MODERATOR') {
        res.status(403).json({ error: 'Access denied. Moderator privileges required.' });
        return;
    }
    next();
}
/**
 * Middleware: Require ADMIN or EMPLOYEE role
 */
export function requireEmployee(req, res, next) {
    if (!req.user) {
        res.status(401).json({ error: 'Authentication required.' });
        return;
    }
    const role = req.user.role?.toUpperCase();
    if (role !== 'ADMIN' && role !== 'EDITOR' && role !== 'EMPLOYEE') {
        res.status(403).json({ error: 'Access denied. Employee privileges required.' });
        return;
    }
    next();
}
/**
 * Middleware: Require any authenticated user (CLIENT, EMPLOYEE, ADMIN, etc.)
 */
export function requireAuth(req, res, next) {
    authenticate(req, res, next);
}
