const endpointsJson = require("../endpoints.json");
/* Set up your test imports here */
const db = require("../db/connection.js")
const seed = require("../db/seeds/seed.js")
const data = require("../db/data/test-data")

const request = require("supertest");

const app = require("../app.js");

/* Set up your beforeEach & afterAll functions here */
beforeEach(() => {
    return seed(data);
});

afterAll(() => {
    return db.end();
});

describe("GET /api", () => {
  test("200: Responds with an object detailing the documentation for each endpoint", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body: { endpoints } }) => {
        expect(endpoints).toEqual(endpointsJson);
      });
  });
});

describe("GET /api/topics", () => {
  test("200: Responds with an object containing an array of topics", () => {
    return request(app)
    .get("/api/topics")
    .expect(200)
    .then(({ body }) => {
      const topicsList = body.topics
      topicsList.forEach((topic) => {
        const { slug, description } = topic
        expect(typeof slug).toBe("string")
        expect(typeof description).toBe("string")
      })
      expect(topicsList.length).not.toBe(0);
    })
  })
})