const express = require("express");
//const db = require("./db/connection");
const { getEndpointsJSON } = require("./controllers/app.controllers.js")

const app = express();

app.get('/api', getEndpointsJSON);

module.exports = app