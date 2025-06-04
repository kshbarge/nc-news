const endpointsJson = require("../endpoints.json")
const { fetchTopics } = require("../models/app.models.js")

const getEndpointsJSON = (request,response) => {
  response.status(200).send({endpoints: endpointsJson});
}

const getTopics = (request, response) => {
    fetchTopics().then((topicData) => {
        response.status(200).send({topics: topicData})
    })
}

module.exports = { getEndpointsJSON, getTopics }