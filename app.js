const express = require("express");
//const db = require("./db/connection");
const { getEndpointsJSON, getTopics, getArticles } = require("./controllers/app.controllers.js")

const app = express();

app.get('/api', getEndpointsJSON);

app.get('/api/topics', getTopics);

app.get('/api/articles', getArticles);

module.exports = app