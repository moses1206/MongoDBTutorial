const { Router } = require('express');
const commentRouter = Router({ mergeParams: true });
const { Comment } = require('../models/Comment');
const { Blog } = require('../models/Blog');
const { User } = require('../models/User');
const { isValidObjectId } = require('mongoose');

// blog/:blogId/comment/:commentId
// Router({mergeParams:true}) =>중간에 blogId를 가져올수 있다.

commentRouter.post('/', async (req, res) => {
  try {
    const { blogId } = req.params;
    const { content, userId } = req.body;

    if (!isValidObjectId(blogId))
      return res.status(400).send({ err: 'blogId is invalid' });

    if (!isValidObjectId(userId))
      return res.status(400).send({ err: 'userId is invalid' });

    if (typeof content !== 'string')
      return res.status(400).send({ err: 'content is required' });

    //   Promise.all 을 통해 NonBlocking 구현!!
    const [blog, user] = await Promise.all([
      Blog.findByIdAndUpdate(blogId),
      User.findByIdAndUpdate(userId),
    ]);

    if (!blog || !user)
      return res.status(400).send({ err: 'blog or user dose not exist' });

    if (!blog.islive) res.status(400).send({ err: 'blog is not available' });

    const comment = new Comment({ content, user, blog });

    return res.send({ comment });
  } catch (err) {
    return res.status(400).send({ err: err.message });
  }
});

commentRouter.get('/');

module.exports = { commentRouter };
