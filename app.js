const express = require("express");
const { getEndpointsJSON, getTopics, getArticles, getUsers, getSingleArticle, getArticleComments, postArticleComment } = require("./controllers/app.controllers.js")
const { handleCustomErrors, handlePostgresErrors, handleServerErrors } = require("./errors.js")

const app = express();
app.use(express.json());

app.get('/api', getEndpointsJSON);

app.get('/api/topics', getTopics);

app.get('/api/articles', getArticles);

app.get('/api/users', getUsers);

app.get('/api/articles/:article_id', getSingleArticle)

app.get('/api/articles/:article_id/comments', getArticleComments)

app.post('/api/articles/:article_id/comments', postArticleComment)

app.use(handleCustomErrors);

app.use(handlePostgresErrors);

app.use(handleServerErrors);

module.exports = app