const express = require("express");
const { getEndpointsJSON, getTopics, getArticles, getUsers, getSingleArticle } = require("./controllers/app.controllers.js")

const app = express();

app.get('/api', getEndpointsJSON);

app.get('/api/topics', getTopics);

app.get('/api/articles', getArticles);

app.get('/api/users', getUsers);

app.get('/api/articles/:article_id', getSingleArticle)

module.exports = app