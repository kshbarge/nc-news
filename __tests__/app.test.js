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

describe("GET /api/articles", () => {
  test("200: Responds with an object containing an array of articles", () => {
    return request(app)
    .get("/api/articles")
    .expect(200)
    .then(({body}) => {
      const articlesList = body.articles
      articlesList.forEach((article) => {
        const { author, title, article_id, topic, created_at, votes, article_img_url, comment_count} = article
        expect(typeof author).toBe("string")
        expect(typeof title).toBe("string")
        expect(typeof article_id).toBe("number")
        expect(typeof topic).toBe("string")
        expect(typeof created_at).toBe("string")
        expect(typeof votes).toBe("number")
        expect(typeof article_img_url).toBe("string")
        expect(typeof comment_count).toBe("number")
        expect(Object.hasOwn(article, "body")).toBe(false)
      })
      expect(articlesList.length).not.toBe(0);
    })
  })
})

describe("GET /api/users", () => {
  test("200- Responds with an object containing an array of users", () => {
    return request(app)
    .get("/api/users")
    .expect(200)
    .then(({body}) => {
      const usersList = body.users
      usersList.forEach((user) => {
        const { username, name, avatar_url } = user;
        expect(typeof username).toBe("string")
        expect(typeof name).toBe("string")
        expect(typeof avatar_url).toBe("string")
      })
      expect(usersList.length).not.toBe(0);
    })
  })
})