const faker = require('faker');
const { User } = require('./src/models');
const axios = require('axios');
const URI = 'http://localhost:3000';

generateFakeData = async (userCount, blogsPerUser, commentsPerUser) => {
  try {
    if (typeof userCount !== 'number' || userCount < 1)
      throw new Error('userCount must be a positive integer');
    if (typeof blogsPerUser !== 'number' || blogsPerUser < 1)
      throw new Error('blogsPerUser must be a positive integer');
    if (typeof commentsPerUser !== 'number' || commentsPerUser < 1)
      throw new Error('commentsPerUser must be a positive integer');
    let users = [];
    let blogs = [];
    let comments = [];

    // 1. User 생성 new User를 통해 user._id 가 생성된다
    for (let i = 0; i < userCount; i++) {
      users.push(
        new User({
          username: faker.internet.userName() + parseInt(Math.random() * 100),
          name: {
            first: faker.name.firstName(),
            last: faker.name.lastName(),
          },
          age: 10 + parseInt(Math.random() * 50),
          email: faker.internet.email(),
        })
      );
    }

    console.log('fake data inserting to database...');

    await User.insertMany(users);
    console.log(`${users.length} fake users generated!`);

    // 2. User가 블로그를 생성 , Comment를 생성할때 blog._id를 알아야 하는데
    //    new Blog를 사용할 수 없어서 API로 블로그를 생성해야 _id를 받아온다.
    users.map((user) => {
      for (let i = 0; i < blogsPerUser; i++) {
        blogs.push(
          axios.post(`${URI}/blog`, {
            title: faker.lorem.words(),
            content: faker.lorem.paragraphs(),
            islive: true,
            userId: user.id,
          })
        );
      }
    });

    // Promise All 을 사용하여 blogs.push를 NonBlocking으로 처리한다.
    // MongoDB에서 오는 response를 newBlogs에 저장한다. depth는 newBlogs.data.blog._id ..... 이다.
    let newBlogs = await Promise.all(blogs);
    console.log(`${newBlogs.length} fake blogs generated!`);

    users.map((user) => {
      for (let i = 0; i < commentsPerUser; i++) {
        //   블로그의 길이만큼 인덱스를 생성한다.
        let index = Math.floor(Math.random() * blogs.length);
        comments.push(
          // newBlogs 1개를 꺼내서 blog._id를 적용한다.
          axios.post(`${URI}/blog/${newBlogs[index].data.blog._id}/comment`, {
            content: faker.lorem.sentence(),
            userId: user.id,
          })
        );
      }
    });

    // NonBlocking으로 comments.push를 처리한다.
    await Promise.all(comments);
    console.log(`${comments.length} fake comments generated!`);
    console.log('COMPLETE!!');
  } catch (err) {
    console.log(err);
  }
};

module.exports = { generateFakeData };
