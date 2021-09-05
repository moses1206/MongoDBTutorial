console.log('Client code running !!');
const axios = require('axios');

const URI = 'http://localhost:3000';

// 비효율적인 방법 : blogCount = 20 => 6초
// 비효율적인 방법 : blogCount = 50 => 20초

const test = async () => {
  console.time('loading time: ');
  // Get Blog Data
  let {
    data: { blogs },
  } = await axios.get(`${URI}/blog`);

  // Get Blog Data With User Data and Comment Data
  blogs = await Promise.all(
    blogs.map(async (blog) => {
      const [res1, res2] = await Promise.all([
        axios.get(`${URI}/user/${blog.user}`),
        axios.get(`${URI}/blog/${blog._id}/comment`),
      ]);
      blog.user = res1.data.user;
      blog.comments = await Promise.all(
        res2.data.comments.map(async (comment) => {
          const {
            data: { user },
          } = (comment.user = await axios.get(`${URI}/user/${comment.user}`));

          comment.user = user;

          return comment;
        })
      );
      return blog;
    })
  );
  console.timeEnd('loading time: ');
};

const testGroup = async () => {
  await test();
  await test();
  await test();
  await test();
  await test();
  await test();
  await test();
  await test();
};

testGroup();
