const endpointsJson = require("../endpoints.json")
const { fetchTopics, fetchArticles, fetchUsers } = require("../models/app.models.js")

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

module.exports = { getEndpointsJSON, getTopics, getArticles, getUsers }