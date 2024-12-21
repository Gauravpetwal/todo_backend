const jwt = require('jsonwebtoken');

const authentication = (req, res, next) => {    
      const token = req.headers['authorization']?.split(' ')[1]; 
    if (!token) {
        return res.status(401).json({ message: "Unauthorized" }); 
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => { 
        if (err) {
            console.error("Token verification failed:", err);
            return res.status(403).json({ message: "Not authorized" }); 
        }

        req.user = decoded; 
        next(); 
    });
};

module.exports = authentication;
