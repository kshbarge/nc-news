const express = require("express");
//const db = require("./db/connection");
const { getEndpointsJSON, getTopics } = require("./controllers/app.controllers.js")

const app = express();

app.get('/api', getEndpointsJSON);

app.get('/api/topics', getTopics);

module.exports = app