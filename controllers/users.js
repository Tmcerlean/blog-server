const { body, validationResult } = require('express-validator');
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const passport = require("passport");
const bcrypt = require("bcryptjs");

exports.login_post = (req, res, next) => {
    passport.authenticate('local', { session: false, successRedirect: '/', failureRedirect: '/bla' }, (err, user, info) => {
        if (err || !user) {
            return res.status(400).json({ 
                message: 'Something went wrong',
                user 
            });
        }
        req.login(user, { session: false }, (error) => {
            if (error) res.send(error);

            // Generate a signed json web token with the contents of user object and return it in the response
            const token = jwt.sign({ user }, process.env.JWT_SECRET, {
                expiresIn: '1d',
            });
            let data = { _id: user._id, username: user.username};
            return res.json({ user: data, token });
        });
    })(req, res);
}

exports.logout_post = function(req, res, next) {
    return res.json('Received a POST HTTP method');
}

exports.signup_post = [

    // Validate and sanitize fields
    body('username').trim().isLength({ min: 1 }).escape().withMessage('Username must be specified')
    .isAlphanumeric().withMessage('Username has non-alphanumeric characters'),
    body("password").isLength({ min: 6 }).withMessage("Password must contain at least 6 characters"),

    // Process request after validation and sanitization.
    async (req, res, next) => {

        // Extract the validation errors from a request.
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            // There are errors in the form data.
            return res.json({
                username: req.body.username,
                errors: errors.array(),
            });
        }
        else {
            // Data from form is valid.

            // Check if username already exists.
            await User.findOne({ 'username': req.body.username })
                .exec(function(err, found_username) {

                    if (found_username) {
                        return next(err);
                    } 

                    else if (err) { return next(err); }
                    
                    else {
                        // Create a user object with escaped and trimmed data
                        bcrypt.hash(req.body.password, 10, (err, hashedPassword) => {
                            // If err, do something
                            if (err) { 
                                return next(err);
                            };
                            // Otherwise, store hashedPassword in DB
                            const user = new User({
                                username: req.body.username,
                                password: hashedPassword,
                                admin: false,
                            }).save(err => {
                                if (err) { 
                                    return next(err);
                                };
                                res.status(200).json({
                                    message: "Signed up successfully",
                                    user: req.user,
                                });
                            });
                        });
                    }
            })
        }
    }
];