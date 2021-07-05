const { body, validationResult } = require('express-validator');
const Post = require("../models/post");

exports.get_post = async function (req, res, next) {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) {
            return res
                .status(404)
                .json({ err: `Post with id ${req.params.id} does not exist` });
            }
            res.status(200).json({ post });
    } catch (err) {
        next(err);
    }
};

exports.get_posts = async function (req, res, next) {
    try {
        const posts = await Post.find({});
        if (!posts) {
            return res.status(400).json({ message: "Posts could not be fetched" });
        }
        res.status(200).json({ posts });
    } catch (err) {
        next(err);
    }
};

exports.create_post = [

    // Validate and sanitize fields
    body("title").isLength({ min: 5 }).withMessage("Title must be at least 5 characters").escape(),
    body("body").isLength({ min: 20 }).withMessage("Body must be at least 20 characters").escape(),
  
    // Process request after validation and sanitization.
    async (req, res, next) => {

        // Extract the validation errors from a request.
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            // There are errors in the form data.
            return res.json({
                data: req.body,
                errors: errors.array(),
            });
        }
        
        // Data from form is valid.

        // Title, body, timestamp - default to created time, user, published - default to false
        const { title, body } = req.body;
        const post = new Post({
            title,
            body,
        });
        post.save((err) => {
            if (err) {
                return next(err);
            }
            res.status(200).json({ 
                message: "Post saved",
            });
        });
    },
];

exports.edit_post = async function (req, res, next) {
    try {
        const { title, body } = req.body;
        const post = await Post.findByIdAndUpdate(req.params.id, {
            title,
            body,
        });
        if (!post) {
            return res.status(404);
        }
        res.status(200).json({ 
            message: "Post updated" 
        });
    } catch (err) {
        next(err);
    }
};

exports.delete_post = async function (req, res, next) {
    try {
        const post = await Post.findByIdAndDelete(req.params.id);
        if (!post) {
            return res
                .status(404).json({ 
                    err: `Post with id ${req.params.id} not found` 
                });
        }
        res.status(200).json({ message: `Post ${req.params.id} deleted` });
    } catch (err) {
        next(err);
    }
};