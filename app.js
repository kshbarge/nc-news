const express = require("express");
const { getEndpointsJSON, getTopics, getArticles, getUsers } = require("./controllers/app.controllers.js")

const app = express();

app.get('/api', getEndpointsJSON);

app.get('/api/topics', getTopics);

app.get('/api/articles', getArticles);

app.get('/api/users', getUsers);

module.exports = app