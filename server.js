const mongoose = require('mongoose');
const methodOverride = require("method-override");
const morgan = require("morgan");
const path = require("path");
const Fruit = require('./models/fruit.js');

const dotenv = require("dotenv"); // require package
dotenv.config(); // Loads the environment variables from .env file
const express = require('express');

const app = express();
mongoose.connect(process.env.MONGODB_URI);
mongoose.connection.on("connected", () => {
  console.log(`Connected to MongoDB ${mongoose.connection.name}.`);
});


app.use(express.urlencoded({ extended: false }));
app.use(methodOverride("_method"));
//app.use(morgan("dev"));

app.use(express.static(path.join(__dirname, "public")));


// POST /fruits
app.post("/fruits", async (req, res) => {
  if (req.body.isReadyToEat === "on") {
    req.body.isReadyToEat = true;
  } else {
    req.body.isReadyToEat = false;
  }
  await Fruit.create(req.body);
  res.redirect("/fruits"); // redirect to index fruits
});

app.get("/fruits", async (req, res) => {
  const allFruits = await Fruit.find();
  res.render("fruits/index.ejs", { fruits: allFruits });
});


// GET /fruits
app.get("/fruits", async (req, res) => {
  const allFruits = await Fruit.find();
  console.log(allFruits); // log the fruits!
  res.send("Welcome to the index page!");
});


// GET /fruits/new
app.get("/fruits/new", (req, res) => {
  res.render("fruits/new.ejs");
});

// GET /fruits/new
// app.get("/fruits/new", (req, res) => {
//   res.send("This route sends the user a form page!");
// });

app.get("/fruits/:fruitId", async (req, res) => {
  const foundFruit = await Fruit.findById(req.params.fruitId);
  res.render("fruits/show.ejs", { fruit: foundFruit });
});

// POST /fruits
app.post("/fruits", async (req, res) => {
  if (req.body.isReadyToEat === "on") {
    req.body.isReadyToEat = true;
  } else {
    req.body.isReadyToEat = false;
  }
  await Fruit.create(req.body);
  res.redirect("/fruits/new");
});

// GET /
app.get("/", async (req, res) => {
  res.render("index.ejs");
});

app.delete("/fruits/:fruitId", async (req, res) => {
  await Fruit.findByIdAndDelete(req.params.fruitId);
  res.redirect("/fruits");
});

app.get("/fruits/:fruitId/edit", async (req, res) => {
  const foundFruit = await Fruit.findById(req.params.fruitId);
  res.render("fruits/edit.ejs", {
    fruit: foundFruit,
  });
});

// server.js

app.put("/fruits/:fruitId", async (req, res) => {
  // Handle the 'isReadyToEat' checkbox data
  if (req.body.isReadyToEat === "on") {
    req.body.isReadyToEat = true;
  } else {
    req.body.isReadyToEat = false;
  }
  
  // Update the fruit in the database
  await Fruit.findByIdAndUpdate(req.params.fruitId, req.body);

  // Redirect to the fruit's show page to see the updates
  res.redirect(`/fruits/${req.params.fruitId}`);
});


app.listen(3000, () => {
  console.log('Listening on port 3000');
});

