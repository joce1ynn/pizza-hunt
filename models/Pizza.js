// 我们可以导入整个mongoose库，但我们只需要关心Schema构造函数和model函数，所以我们只需要导入它们。
const { Schema, model } = require("mongoose");
const dateFormat = require("../utils/dateFormat");

const PizzaSchema = new Schema({
  pizzaName: { type: String },
  createdBy: { type: String },
  createdAt: {
    type: Date,
    default: Date.now, //If no value is provided in this field when the user creates new data, the Date.now function will be executed and will provide a timestamp. This way we don't have to create the timestamp elsewhere and send that data.
    get: (createdAtVal) => dateFormat(createdAtVal),
  },
  size: {
    type: String,
    default: "large",
  },
  toppings: [], // []表示数组作为数据类型。您还可以指定Array代替括号
  // In Mongoose we can instruct the parent to keep track of its children,
  comments: [
    {
      type: Schema.Types.ObjectId, //tell Mongoose to expect an ObjectId
      ref: "Comment", // ref tells the Pizza model which documents to search to find the right comments.
    },
    // 告诉model它可以使用virtuals
    {
      toJSON: {
        virtuals: true,
        getters: true,
      },
      id: false, // id为false因为这是 Mongoose 返回的虚拟，我们不需要它。
    },
  ],
});

// get total count of comments and replies on retrieval
// add virtual properties to a document that aren't stored in the database.
// They're computed values that get evaluated when you try to access their properties.
PizzaSchema.virtual("commentCount").get(function () {
  return this.comments.length;
});

// create the Pizza model using the PizzaSchema
const Pizza = model("Pizza", PizzaSchema);

// export the Pizza model
module.exports = Pizza;
