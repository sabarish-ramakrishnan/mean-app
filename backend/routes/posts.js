const express = require("express");


const Post = require('../models/postModel');
const checkAuth = require("../middleware/check-auth");
const extractfile = require("../middleware/extract-file");
const postController = require('../controllers/postcontroller');

const router = express.Router();



router.get('', postController.getPosts);

router.post('', checkAuth, extractfile, postController.createPost);

router.get('/:id', postController.getPostById);

router.put('/:id', checkAuth, postController.updatePost);

router.delete('/:id', checkAuth, postController.deletePost);

module.exports = router;
