require("dotenv").config();
const express = require("express");
const apiKey = process.env.APIKEY;
const port = process.env.PORT;
const app = express();

app.set("view engine", "ejs");
app.set("views", "./views");

app.use(express.static("public"));

app.get("/", function (req, res) {
  res.render("index", {});
});

app.get("/", function (req, res) {
  res.render("index", {});
});

app.get("/detail/:id", function (req, res) {
  fetch(
    `https://www.rijksmuseum.nl/api/nl/collection/${req.params.id}?key=${apiKey}`
  )
    .then(async (response) => {
      const artWorks = await response.json();
      res.render("detail", {
        pageTitle: "Art" + req.params.id,
        data: artWorks.artObject,
      });
    })
    .catch((err) => res.send(err));
});

app.listen(port, () => {
  console.log(`Now listening on port ${port}`);
});
