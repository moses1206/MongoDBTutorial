const express = require('express');
const app = express();
const config = require('./config/key');
const { blogRouter, commentRouter, userRouter } = require('./routes');
const { generateFakeData } = require('../faker');

const mongoose = require('mongoose');

const server = async () => {
  try {
    await mongoose.connect(config.mongoURI);
    mongoose.set('debug', true);
    console.log('MongoDB Connected !!');
    app.use(express.json());

    // Faker Data insert
    // 100명의 유저가 10개의 포스트를 작성하고 30개의 댓글을 입력한다.
    // await generateFakeData(100, 10, 300);

    // Router Setting
    app.use('/user', userRouter);
    app.use('/blog', blogRouter);
    app.use('/blog/:blogId/comment', commentRouter);

    // Server Port
    app.listen(3000, () => {
      console.log('Server listen on port 3000');
    });
  } catch (err) {
    console.log(err);
  }
};

server();
