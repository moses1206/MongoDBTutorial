const { Schema, model, Types } = require('mongoose');

const BlogSchema = new Schema(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    islive: { type: Boolean, required: true, default: false },
    /***************************************************************/
    /*********************** 데이터 내장하기 ************************/
    /** Blog 안의 유저 데이터중 필요한 것(username,nama)만 내장시킴 **/
    /***************************************************************/
    user: {
      _id: { type: Types.ObjectId, required: true, ref: 'user' },
      username: {
        type: String,
        require: true,
      },
      name: {
        first: { type: String, required: true },
        last: { type: String, required: true },
      },
    },
  },
  //   CreatedAt,UpdatedAt 생성
  { timestamps: true }
);

// DB에 저장되는 것은 아니지만 가상의 필드를 만든다.
BlogSchema.virtual('comments', {
  ref: 'comment',
  localField: '_id',
  foreignField: 'blog',
});

BlogSchema.set('toObject', { virtuals: true });
BlogSchema.set('toJSON', { virtuals: true });

const Blog = model('blog', BlogSchema);

module.exports = { Blog };
