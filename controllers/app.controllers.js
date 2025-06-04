const endpointsJson = require("../endpoints.json")
const { fetchEndpointsJSON } = require("../models/app.models.js")

const getEndpointsJSON = (request,response) => {
  response.status(200).send({endpoints: endpointsJson});
}

module.exports = { getEndpointsJSON }