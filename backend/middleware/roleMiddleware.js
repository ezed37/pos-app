export const authorizeRole = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.this.status(401).json({
                message: "No authorized. Please login."
            });
        }

        //check if user's role is in the allowedRoles array
        if (!allowedRoles.includes(req.user.role)) {
            return res.status(403).json({
                message: "Access denied. Insuffiecient permission."
            });
        }
        next();
    };
};