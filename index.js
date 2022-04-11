require("dotenv").config();
const express = require("express");
const projects = require("./examples/projects/routes/projects");
const apiKey = process.env.APIKEY;
const port = process.env.PORT;
const { graphql } = require("@octokit/graphql");
const graphqlAuth = graphql.defaults({
  headers: {
    authorization: "token " + process.env.APILKEY,
  },
});
const app = express();

app.set("view engine", "ejs");
app.set("views", "./views");

app.use(express.static("public"));

app.get("/", function (req, res) {
  // Get the repository information from my GitHub account
  graphqlAuth(`{
    viewer {
          repositories(first: 100, orderBy: {field: UPDATED_AT, direction: DESC}, privacy: PUBLIC, isFork: true) {
            edges {
              node {
                name
                url
                description
                updatedAt
                homepageUrl
              }
            }
          }
        }
      }`).then((data) => {
    console.log(data);
    res.render("index", {
      projects: data.user.repositories.edges,
    });
  });
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
