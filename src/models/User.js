const { Schema, model } = require('mongoose');

const UserSchema = new Schema(
  {
    username: {
      type: String,
      require: true,
      unique: true,
    },
    name: {
      first: { type: String, required: true },
      last: { type: String, required: true },
    },
    age: { type: Number },
    email: { type: String },
  },
  //   timestamps: true =>모델의 CreatedAt , UpdatedAt 생성
  { timestamps: true }
);

const User = model('user', UserSchema);

module.exports = { User };
