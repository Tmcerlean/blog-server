const express = require('express');
const router = express.Router();
const passport = require('passport');

const commentController = require('../controllers/comments');
const postController = require('../controllers/posts');
const userController = require('../controllers/users');



///// COMMENTS

// GET single comment - /api/posts/:postid/comments/:commentid
router.get('/posts/:postid/comments/:commentid', commentController.get_comment)

// GET all comments - /api/posts/:postid/comments
router.get('/posts/:postid/comments', commentController.get_comments)

// POST create comment - /api/posts/:postid/comments
router.post('/posts/:postid/comments', [
  // passport.authenticate('jwt', {session: false}),
  commentController.create_comment
])

// PUT edit comment - /api/posts/:postid/comments/:commentid
router.put('/posts/:postid/comments/:commentid', [
  // passport.authenticate('jwt', {session: false}),
  commentController.edit_comment
])

// DELETE single comment - /api/posts/:postid/comments/:commentid
router.delete('/posts/:postid/comments/:commentid', [
  // passport.authenticate('jwt', {session: false}),
  commentController.delete_comment
])

// DELETE all of single post's comments
router.delete('/posts/:postid/comments', [
    // passport.authenticate("jwt", { session: false }),
    commentController.delete_comments
])



///// POSTS

// GET single post - /api/posts/:id
router.get('/posts/:id', postController.get_post)

// GET all posts - /api/posts
router.get('/posts', postController.get_posts)

// POST create post - /api/posts
router.post('/posts', [
  // passport.authenticate('jwt', {session: false}),
  postController.create_post
])

// PUT edit post - /api/posts/:id
router.put('/posts/:id', [
  // passport.authenticate('jwt', {session: false}),
  postController.edit_post
])

// DELETE post - /api/posts/:id
router.delete('/posts/:id', [
  // passport.authenticate('jwt', {session: false}),
  postController.delete_post
])

// PUT/POST publish post

// PUT/POST unpublish post



///// USERS

// POST request for user log in - /api/login
router.post('/login', userController.login_post);

// POST request for log out - /api/logout
router.post('/logout', userController.logout_post);

// POST request for user sign up - /api/signup
router.post('/signup', userController.signup_post);


module.exports = router;
