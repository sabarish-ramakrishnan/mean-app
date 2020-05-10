
const Post = require('../models/postModel');

exports.getPosts = (req, res, next) => {
  //console.log(req.query);
  const pageSize = +req.query.pagesize;
  const currentPage = +req.query.page;
  let postQuery = Post.find();
  if (pageSize && currentPage) {
    postQuery = postQuery.skip(pageSize * (currentPage - 1)).limit(pageSize)
  }
  postQuery.then(documents => {
    res.status(200).json({
      message: 'Posts fetched successfully',
      posts: documents
    });
  }).catch(e => {
    console.log(e);
    res.status(500).json({
      message: 'fetching post failed'
    });
  });
}

exports.getPostById=(req, res, next) => {
  Post.findById(req.params.id).then(post => {
    if (post) {
      console.log('Post fetched successfully ' + post);
      res.status(200).json({
        message: 'Post found',
        _id: post._id,
        content: post.content,
        title: post.title
      });
    } else {
      res.status(404).json({
        message: 'Post not found'
      });
    }
  });
}

exports.createPost=(req, res, next) => {
  const url = req.protocol + '://' + req.get('host');
  console.log(req.userData);
  const post = new Post({
    title: req.body.title,
    content: req.body.content,
    imagePath: url + '/images/' + req.file.filename,
    creator: req.userData.userId
  });
  post.save().then(createdPost => {
    console.log(post);
    res.status(201).json({
      message: 'posted successfully!!',
      post: {
        ...createdPost,
        id: createdPost._id,
      }
    });
  }).catch(e => {
    console.log(e);
    res.status(500).json({
      message: 'creating a post failed'
    });
  });
}

exports.updatePost=(req, res, next) => {
  const post = new Post({
    _id: req.body.id,
    title: req.body.title,
    content: req.body.content,
    creator: req.userData.userId
  });

  Post.updateOne({
    _id: req.params.id,
    creator: req.userData.userId
  }, post).then(result => {
    console.log(result);
    if(result.n > 0){
      res.status(200).json({
        message: 'post updated successfully!!'
      });
    }
    else{
      res.status(401).json({
        message: 'not authorised'
      });
    }
  }).catch((err) => {
    console.log(err);
    res.status(500).json({
      message: 'post updated successfully'
    });
  });
}

exports.deletePost=(req, res, next) => {
  Post.deleteOne({
    _id: req.params.id,
    creator: req.userData.userId
  }).then(result => {
    console.log('post deleted');
    console.log(result);
    if (result.n > 0) {
      res.status(200).json({
        message: 'post deleted successfully'
      });
    } else {
      res.status(401).json({
        message: 'Not authorised'
      });
    }
  }).catch(e => {
    console.log(e);
    res.status(500).json({
      message: 'deleting a post failed'
    });
  });
}
