// 我们可以导入整个mongoose库，但我们只需要关心Schema构造函数和model函数，所以我们只需要导入它们。
const { Schema, model } = require("mongoose");
const dateFormat = require("../utils/dateFormat");

const PizzaSchema = new Schema(
  {
    pizzaName: {
      type: String,
      required: true, //Data Validation
      trim: true, //removes white space before and after the input string
    },
    createdBy: {
      type: String,
      required: true,
      trim: true,
    },
    createdAt: {
      type: Date,
      default: Date.now, //If no value is provided in this field when the user creates new data, the Date.now function will be executed and will provide a timestamp. This way we don't have to create the timestamp elsewhere and send that data.
      get: (createdAtVal) => dateFormat(createdAtVal), //有了这个get选项，每次我们检索披萨时，该createdAt字段中的值都将由dateFormat()函数格式化并使用，而不是默认的时间戳值
    },
    size: {
      type: String,
      required: true,
      enum: ["Personal", "Small", "Medium", "Large", "Extra Large"],
      //enum选项代表enumerable，是一组可以迭代的数据——就像使用for...in循环来迭代一个对象一样。
      //如果用户尝试输入未列出的披萨尺寸，验证将根本不允许。
      default: "large",
    },
    toppings: [], // []表示数组作为数据类型。您还可以指定Array代替括号
    // In Mongoose we can instruct the parent to keep track of its children,
    comments: [
      {
        type: Schema.Types.ObjectId, //tell Mongoose to expect an ObjectId
        ref: "Comment", // ref tells the Pizza model which documents to search to find the right comments.
      },
    ],
  },
  // 告诉model它可以使用virtuals
  {
    toJSON: {
      virtuals: true,
      getters: true, //a getter is typically a special type of function that takes the stored data you are looking to retrieve and modifies or formats it upon return. Think of it like middleware for your data!
    },
    id: false, // id为false因为这是 Mongoose 返回的虚拟，我们不需要它。
  }
);

// get total count of comments and replies on retrieval
// add virtual properties to a document that aren't stored in the database.
// They're computed values that get evaluated when you try to access their properties.
PizzaSchema.virtual("commentCount").get(function () {
  //commentCount  includes all replies as well.
  return this.comments.reduce(
    (total, comment) => total + comment.replies.length + 1,
    0
  );
  //我们使用该.reduce()方法来统计每条评论及其回复的总数
  //.reduce() takes two parameters, an accumulator and a currentValue
  // total is the last # of comment
  // comment.replies.length is the # of replies
  // + 1 is the current comment
  // 0 means start count from 0
});

// create the Pizza model using the PizzaSchema
const Pizza = model("Pizza", PizzaSchema);

// export the Pizza model
module.exports = Pizza;
