const jwt = require('jsonwebtoken');

const middlewareController = {
    verifyToken: (req, res, next) => {
        const token = req.headers.authorization;
        // console.log(token);
        if (!token) return res.status(401).json("You're not authenticated");

        const accessToken = token.split(' ')[1];

        jwt.verify(accessToken, process.env.SUNNY_DRIVE_SECRET_ACCESS_KEY, (err, user) => {
            // console.log(err);
            if (err) return res.status(403).json('Token is not valid');

            req.body.user = user ;
            next();
        });
    },
}

module.exports = middlewareController;