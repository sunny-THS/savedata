const bcrypt = require('bcryptjs'); // hash pw
const jwt = require('jsonwebtoken'); // create token for account
const User = require('../models/User');

/*
body
{
    username: String,
    pw: String
}
*/

const authentication = {
    generateAccessToken: user => {
        return jwt.sign(
            {
                id: user.id,
                name: user.username
            },
            process.env.SUNNY_DRIVE_SECRET_ACCESS_KEY, // save to cookie in client
            { expiresIn: '45m' }
        );
    },
    // REGISTER
    registerUser: async(req, res) => {
        try {
            const salt = await bcrypt.genSalt();
            // hash password
            const hashed = await bcrypt.hash(req.body.pw, salt);
            // check exists of user
            await User.findOne({ username: req.body.username })
                .then( async (user) => {
                    console.log(user);
                    if (user)
                        return res.status(401).json("Username is exists!");
                    
                    // user is not exists
                    // create new user
                    const newUser = await new User({
                        username: req.body.username,
                        password: hashed
                    });
                    
                    // save to mongodb
                    await newUser.save();
                    res.json('Successful');
                })
        } catch (error) {
            res.status(500).json(error.message);
        }
    },
    // LOGIN
    login: async(req, res) => {
        try {
            const user = await User.findOne({ username: req.body.username });
            if (!user)
                return res.status(404).json('Wrong username');

            const validPw = await bcrypt.compare(req.body.pw, user.password);
            if (!validPw)
                return res.status(404).json('Wrong password');

            // successful
            const accessToken = authentication.generateAccessToken(user);

            const {password, ...other} = user._doc;
            res.json({ ...other, accessToken });

        } catch (error) {
            res.json(error.message)
        }
    }
};

module.exports = authentication;