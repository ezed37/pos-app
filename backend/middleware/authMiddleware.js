import jwt from "jsonwebtoken";

export const protect = (req, res, next) => {
    try {
        let token = req.headers.authorization;

        if (token && token.startsWith("Bearer ")) {
            token = token.split(" ")[1]; // get the token only (remove "Bearer ")

            // Verify token using our secret key
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Add user data from token into request (so controller can use it)
            req.user = decoded;

            // Continue to next function
            next();
        } else {
            res.status(401).json({ message: "No token, authorization denied" });
        }
    } catch (error) {
        res.status(401).json({ message: "Invalid or expired token" });
    }
};
