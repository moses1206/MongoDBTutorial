const { Router } = require('express');
const blogRouter = Router();
const { Blog, User } = require('../models');
const { isValidObjectId } = require('mongoose');
const { commentRouter } = require('./commentRoute');

// blogRouter.use('/:blogId/comment', commentRouter);

blogRouter.post('/', async (req, res) => {
  try {
    const { title, content, islive, userId } = req.body;

    if (typeof title !== 'string')
      res.status(400).send({ err: 'title is required' });

    if (typeof content !== 'string')
      res.status(400).send({ err: 'content is required' });

    if (islive && islive !== 'boolean')
      res.status(400).send({ err: 'islive must be boolean' });

    if (!isValidObjectId(userId))
      res.status(400).send({ err: 'User ID is invalid' });

    let user = await User.findById(userId);
    if (!user) res.status(400).send({ err: 'user dose not exist' });

    // user를 가져온 풀데이터로 교체
    let blog = new Blog({ ...req.body, user: user });
    await blog.save();

    return res.send({ blog });
  } catch (err) {
    console.log(err);
    res.status(500).send({ err: err.message });
  }
});

blogRouter.get('/', async (req, res) => {
  try {
    const blogs = await Blog.find({}).limit(10);
    return res.send({ blogs });
  } catch (err) {
    console.log(err);
    res.status(500).send({ err: err.message });
  }
});

blogRouter.get('/:blogId', async (req, res) => {
  try {
    const { blogId } = req.params;

    if (!isValidObjectId(blogId))
      res.status(400).send({ err: 'Blog ID is invalid' });

    const blog = await Blog.findOne({ _id: blogId });
    return res.send({ blog });
  } catch (err) {
    console.log(err);
    res.status(500).send({ err: err.message });
  }
});

// 블로그 게시글 전체수정
blogRouter.put('/:blogId', async (req, res) => {
  try {
    const { blogId } = req.params;

    if (!isValidObjectId(blogId))
      res.status(400).send({ err: 'Blog ID is invalid' });

    const { title, content } = req.body;

    if (typeof title !== 'string')
      res.status(400).send({ err: 'title is required' });

    if (typeof content !== 'string')
      res.status(400).send({ err: 'content is required' });

    const blog = await Blog.findByIdAndUpdate(
      { _id: blogId },
      { title, content },
      //   바뀐결과값 리턴
      { new: true }
    );

    return res.send({ blog });
  } catch (err) {
    console.log(err);
    res.status(500).send({ err: err.message });
  }
});

// 블로그 컨텐츠 부분수정
blogRouter.patch('/:blogId/live', async (req, res) => {
  try {
    const { blogId } = req.params;

    if (!isValidObjectId(blogId))
      res.status(400).send({ err: 'blogId is invalid' });

    const { islive } = req.body;

    if (typeof islive !== 'boolean')
      res.status(400).send({ err: 'boolean islive is required' });

    const blog = await Blog.findByIdAndUpdate(
      blogId,
      { islive },
      { new: true }
    );
    res.send({ blog });
  } catch (err) {
    console.log(err);
    res.status(500).send({ err: err.message });
  }
});

module.exports = { blogRouter };
