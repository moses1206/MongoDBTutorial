const express = require('express');
const app = express();
const config = require('./config/key');
const { userRouter } = require('./routes/userRoute');
const { blogRouter } = require('./routes/blogRoute');
const { commentRouter } = require('./routes/commentRoute');

const mongoose = require('mongoose');

const server = async () => {
  try {
    await mongoose.connect(config.mongoURI);
    mongoose.set('debug', true);
    console.log('MongoDB Connected !!');
    app.use(express.json());

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
