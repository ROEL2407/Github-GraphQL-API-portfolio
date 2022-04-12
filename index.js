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

app.set("view engine", "ejs");
app.set("views", "./views");

app.use(express.static("public"));

app.get("/", function (req, res) {
  // Get the repository information from our GitHub account
  graphqlAuth(`{
    viewer {
          repositories(first: 100, orderBy: {field: UPDATED_AT, direction: DESC}, privacy: PUBLIC, isFork: true) {
            edges {
              node {
                id
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
    res.render("index", {
      projects: data.viewer.repositories.edges,
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
    console.log(data.node.owner.login);
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
      console.log(newData.repository.object.text);
      res.render("detail", {
        projects: data,
        readMe: newData,
      });
    });
  });
});

app.listen(port, () => {
  console.log(`Now listening on port ${port}`);
});
