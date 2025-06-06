const endpointsJson = require("../endpoints.json")
const { fetchTopics, fetchArticles, fetchUsers,fetchSingleArticle, fetchArticleComments, addArticleComment, updateArticleVotes } = require("../models/app.models.js")

const getEndpointsJSON = (request,response) => {
  response.status(200).send({endpoints: endpointsJson});
}

const getTopics = (request, response) => {
    fetchTopics().then((topicData) => {
        response.status(200).send({topics: topicData})
    })
}

const getArticles = (request, response) => {
    fetchArticles().then((articleData) => {
        response.status(200).send({articles: articleData})
    })
}

const getUsers = (request, response) => {
    fetchUsers().then((userData) => {
        response.status(200).send({users: userData})
    })
}

const getSingleArticle = (request, response, next) => {
    const { article_id } = request.params;
    fetchSingleArticle(article_id).then((singleArticle) => {
        response.status(200).send({article: singleArticle})
    })
    .catch((err) => {
        next(err);
    })
}

const getArticleComments = (request, response, next) => {
    const { article_id } = request.params
    fetchArticleComments(article_id).then((commentData) => {
        response.status(200).send({comments: commentData})
    })
    .catch((err) => {
        next(err);
    })
}

const postArticleComment = (request, response, next) => {
    const {username, body} = request.body
    const { article_id } = request.params

    if(Object.hasOwn(request.body, "username") === false || Object.hasOwn(request.body, "body" === false)) {
        return Promise.reject({status: 400, msg: "Bad request"})
    }

    addArticleComment(username, body, article_id).then((postedComment) => {
        response.status(201).send({comment: postedComment})
    })
    .catch((err) => {
        next(err)
    })
}

const patchArticleVotes = (request, response, next) => {
    const {inc_votes} = request.body
    const {article_id} = request.params
    updateArticleVotes(inc_votes, article_id).then((patchedArticle) => {
        response.status(200).send({article: patchedArticle})
    })
    .catch((err) => {
        console.log(err)
        next(err)
    })
}

module.exports = { getEndpointsJSON, getTopics, getArticles, getUsers, getSingleArticle, getArticleComments, postArticleComment, patchArticleVotes }