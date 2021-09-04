// 이번 강의에서 하단에 있는 코드로 가짜 데이터를 생성할거에요. faker라는 모듈을 사용할겁니다.
// 루트 경로(packege.json이 있는 곳)에 faker.js를 생성해주시고 아래 코드를 복사해서 삽입해주세요.
// 그리고 npm i faker로 faker를 꼭 설치해주세요.

const faker = require('faker');
const { User, Blog, Comment } = require('./src/models');

generateFakeData = async (userCount, blogsPerUser, commentsPerUser) => {
  if (typeof userCount !== 'number' || userCount < 1)
    throw new Error('userCount must be a positive integer');
  if (typeof blogsPerUser !== 'number' || blogsPerUser < 1)
    throw new Error('blogsPerUser must be a positive integer');
  if (typeof commentsPerUser !== 'number' || commentsPerUser < 1)
    throw new Error('commentsPerUser must be a positive integer');
  const users = [];
  const blogs = [];
  const comments = [];
  console.log('Preparing fake data.');

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

  users.map(async (user) => {
    for (let i = 0; i < blogsPerUser; i++) {
      blogs.push(
        new Blog({
          title: faker.lorem.words(),
          content: faker.lorem.paragraphs(),
          islive: true,
          user,
        })
      );
    }
  });

  users.map((user) => {
    for (let i = 0; i < commentsPerUser; i++) {
      let index = Math.floor(Math.random() * blogs.length);
      comments.push(
        new Comment({
          content: faker.lorem.sentence(),
          user,
          blog: blogs[index]._id,
        })
      );
    }
  });

  console.log('fake data inserting to database...');
  await User.insertMany(users);
  console.log(`${users.length} fake users generated!`);
  await Blog.insertMany(blogs);
  console.log(`${blogs.length} fake blogs generated!`);
  await Comment.insertMany(comments);
  console.log(`${comments.length} fake comments generated!`);
  console.log('COMPLETE!!');
};

module.exports = { generateFakeData };
