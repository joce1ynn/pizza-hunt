const { Pizza } = require("../models");

const pizzaController = {
  // get all pizzas
  getAllPizza(req, res) {
    Pizza.find({}) // 很像 Sequelize.findAll()方法。
      //joined two tables in MongoDB we'll populate a field.
      .populate({
        path: "comments",
        select: "-__v", // we don't care about the __v field on comments. The minus sign - indicates that we don't want it to be returned. If we didn't have it, it would mean that it would return only the __v field.
      })
      .select("-__v")
      .sort({ _id: -1 }) //sort in DESC order by the _id value. This gets the newest pizza
      .then((dbPizzaData) => res.json(dbPizzaData))
      .catch((err) => {
        console.log(err);
        res.status(400).json(err);
      });
  },

  // get one pizza by id
  getPizzaById({ params }, res) {
    //我们没有访问整个req，而是对其进行了解构params
    Pizza.findOne({ _id: params.id })
      .populate({
        path: "comments",
        select: "-__v",
      })
      .select("-__v")
      .then((dbPizzaData) => {
        // If no pizza is found, send 404
        if (!dbPizzaData) {
          res.status(404).json({ message: "No pizza found with this id" });
          return;
        }
        res.json(dbPizzaData);
      })
      .catch((err) => {
        console.log(err);
        res.status(400).json(err);
      });
  },

  // createPizza
  createPizza({ body }, res) {
    Pizza.create(body)
      .then((dbPizzaData) => res.json(dbPizzaData))
      .catch((err) => res.json(err));
  },
  // 在 MongoDB 中，将数据添加到集合的方法是.insertOne()或.insertMany().
  // 但是在 Mongoose 中，我们使用该.create()方法，它实际上将处理一个或多个插入！

  // update pizza by id
  // Mongoose 仅​​在我们实际创建新数据时自动执行验证器。
  // 这意味着用户可以创建一个比萨饼，然后用完全不同的数据更新该比萨饼，而无需对其进行验证。
  updatePizza({ params, body }, res) {
    Pizza.findOneAndUpdate({ _id: params.id }, body, {
      new: true,
      runValidators: true, //NEED TO VALIDATE DATA IN UPDATE
    })
      // 如果我们不设置{ new: true }它将返回原始文档。通过将参数设置为true，Mongoose 返回文档的新版本。
      .then((dbPizzaData) => {
        if (!dbPizzaData) {
          res.status(404).json({ message: "No pizza found with this id!" });
          return;
        }
        res.json(dbPizzaData);
      })
      .catch((err) => res.status(400).json(err));
  },

  // delete pizza
  deletePizza({ params }, res) {
    Pizza.findOneAndDelete({ _id: params.id })
      .then((dbPizzaData) => {
        if (!dbPizzaData) {
          res.status(404).json({ message: "No pizza found with this id!" });
          return;
        }
        res.json(dbPizzaData);
      })
      .catch((err) => res.status(400).json(err));
  },
};

module.exports = pizzaController;
