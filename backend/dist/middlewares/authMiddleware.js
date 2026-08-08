import jwt from 'jsonwebtoken';
export const verifyTokenAndRole = (allowedRoles) => {
    return (req, res, next) => {
        // Check in cookies first
        let token = req.cookies?.token; // Assumes your cookie is named 'token'
        //  if cookie is not found
        if (!token) {
            const authHeader = req.headers.authorization;
            if (authHeader && authHeader.startsWith('Bearer ')) {
                token = authHeader.split(' ')[1];
            }
        }
        if (!token) {
            res.status(401).json({ error: 'Authentication required' });
            return;
        }
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = decoded;
            //role check
            if (decoded.role === 'Admin' || allowedRoles.includes(decoded.role)) {
                next();
            }
            else {
                res.status(403).json({ error: 'Access denied: insufficient permissions' });
            }
        }
        catch (error) {
            res.status(401).json({ error: 'Invalid or expired token' });
        }
    };
};
