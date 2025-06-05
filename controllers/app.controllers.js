const endpointsJson = require("../endpoints.json")
const { fetchTopics, fetchArticles } = require("../models/app.models.js")

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

module.exports = { getEndpointsJSON, getTopics, getArticles }