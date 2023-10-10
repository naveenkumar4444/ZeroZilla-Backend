const jwt = require("jsonwebtoken");

const verifyToken = (request, response, next) => {
    const authToken = request.headers.token;
    if (authToken) {
        jwt.verify(authToken, process.env.JWT_SEC_KEY, (error, user) => {
            if (error) {
                return response.status(401).json({
                    status: false,
                    message:"You are not authenticated."
                });
            }
            request.user = user;
            next();
        });
    } else {
        return response.status(403).json({
            status: false,
            message:"Forbidden you are not authorized."
        });
    }
}

module.exports = { verifyToken };
