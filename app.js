const express = require("express");
const data = require("./data");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/labels", function (req, res) {
  res.json(data.labels);
});

app.get("/meals", paginatedResults(data.meals), (req, res) => {
  res.json(res.paginatedResults);
});

function paginatedResults(meals) {
  // middleware function
  return (req, res, next) => {
    const page = parseInt(req.query.page);
    const limit = parseInt(req.query.limit);
    const tag = req.query.tag;
    const results = {};

    if (tag == "all") {
      const startIndex = (page - 1) * limit;
      const endIndex = page * limit;
      results.results = meals.slice(startIndex, endIndex);
      results.totalMeals = meals.length;
    } else {
      results.results = meals.filter((meal) =>
        meal.labels.some((label) => tag === label)
      );
      results.totalMeals = results.results.length;
    }
    res.paginatedResults = results;
    next();
  };
}

app.listen(8080, function () {
  console.log("Server started on port 8080");
});
