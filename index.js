require("dotenv").config();
const express = require("express");
const port = process.env.PORT;
const { graphql } = require("@octokit/graphql");
const graphqlAuth = graphql.defaults({
  headers: {
    authorization: "token " + process.env.APIKEY,
  },
});
const app = express();
const name = process.env.NAME;

app.set("view engine", "ejs");
app.set("views", "./views");

app.use(express.static("public"));

app.get("/", function (req, res) {
  // Get the repository information from our GitHub account
  graphqlAuth(`{
    viewer {
          repositories(first: 100, orderBy: {field: CREATED_AT, direction: DESC}, privacy: PUBLIC) {
            edges {
              node {
                id
                name
                url
                description
                updatedAt
                homepageUrl
                languages(first: 100, orderBy: {field: SIZE, direction: DESC}) {
                  nodes {
                    name
                    color
                  }
                }
              }
            }
          }
        }
      }`).then((data) => {
    res.render("index", {
      projects: data.viewer.repositories.edges,
      name: name,
    });
  });
});

app.get("/detail/:id", function (req, res) {
  // Get the repository information from our GitHub account
  graphqlAuth(
    `{
    node(id:"` +
      req.params.id +
      `") {
        ... on Repository {
          id
          nameWithOwner
          name
          url
          description
          updatedAt
          homepageUrl
          owner {
            login
          }
        }
      }
    }`
  ).then((data) => {
    graphqlAuth(
      `{
        repository(owner: "` +
        data.node.owner.login +
        `", name: "` +
        data.node.name +
        `") {
          object(expression: "HEAD:README.md") {
           ... on Blob {
             text
           }
          }
        }
      }`
    ).then((newData) => {
      // convert readme to html
      var md = require("markdown-it")({
        html: true,
        linkify: true,
        typographer: true,
      });

      if (newData.repository.object !== null) {
        var readMeHTML = md.render(newData.repository.object.text);
      }

      res.render("detail", {
        projects: data,
        readMe: readMeHTML,
        name: name,
      });
    });
  });
});

app.listen(port, () => {
  console.log(`Now listening on port ${port}`);
});
