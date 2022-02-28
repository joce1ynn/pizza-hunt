// 我们可以导入整个mongoose库，但我们只需要关心Schema构造函数和model函数，所以我们只需要导入它们。
const { Schema, model } = require("mongoose");

const PizzaSchema = new Schema({
  pizzaName: { type: String },
  createdBy: { type: String },
  createdAt: {
    type: Date,
    default: Date.now,
    //If no value is provided in this field when the user creates new data, the Date.now function will be executed and will provide a timestamp. This way we don't have to create the timestamp elsewhere and send that data.
  },
  size: {
    type: String,
    default: "large",
  },
  toppings: [],
  // []表示数组作为数据类型。您还可以指定Array代替括号
});

// create the Pizza model using the PizzaSchema
const Pizza = model("Pizza", PizzaSchema);

// export the Pizza model
module.exports = Pizza;
