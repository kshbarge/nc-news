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
  test("200: Accepts various queries and responds with a correctly ordered object", () => {
    return request(app)
    .get("/api/articles?sort_by=votes&&order=ASC")
    .expect(200)
    .then(({body}) => {
      const articlesList = body.articles
      const voteArray = []
      articlesList.forEach((article) => {
        voteArray.push(article.votes)
      })

      const isAscending = voteArray.reduce((isSorted, value, index) => {
        return isSorted && (index === 0 || voteArray[index - 1] <= value);
    }, true);

      expect(isAscending).toBe(true);
    })
  })
  test("200: Can filter the served articles by topic", () => {
    return request(app)
    .get("/api/articles?topic=cats")
    .expect(200)
    .then(({body}) => {
      const articlesList = body.articles
      articlesList.forEach((article) => {
        expect(article.topic).toBe("cats");
      })
    })
  })
  test("200: Responds with an empty array when the topic query is valid but no articles reference it", () => {
    return request(app)
    .get("/api/articles?topic=paper")
    .expect(200)
    .then(({body}) => {
      expect(body.articles).toEqual([]);
    })
  })
  test("404: Responds with an error when a non-specified query is used", () => {
    return request(app)
    .get("/api/articles?sort_by=SQLINTECTION&&order=desc")
    .expect(404)
    .then(({body}) => {
      expect(body.msg).toBe("Invalid query")
    })
  })
  test("404: Responds with an error when an invalid topic query is used", () => {
    return request(app)
    .get("/api/articles?topic=dogs")
    .expect(404)
    .then(({body}) => {
      expect(body.msg).toBe("Not found")
    })
  })
})

describe("GET /api/users", () => {
  test("200: Responds with an object containing an array of users", () => {
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

describe("GET /api/articles/:article_id", () => {
  test("200: Responds with an object with the key of article and the value of an article object", () => {
    return request(app)
    .get("/api/articles/3")
    .expect(200)
    .then(({body}) => {
      const { article } = body;
      expect(typeof article.author).toBe("string")
      expect(typeof article.title).toBe("string")
      expect(article.article_id).toBe(3)
      expect(typeof article.body).toBe("string")
      expect(typeof article.topic).toBe("string")
      expect(typeof article.created_at).toBe("string")
      expect(typeof article.votes).toBe("number")
      expect(typeof article.article_img_url).toBe("string")
    })
  })
  test("400: Responds with an error if the article id is not valid", () => {
    return request(app)
    .get("/api/articles/dagothwave")
    .expect(400)
    .then(({ body }) => {
      expect(body.msg).toBe("Bad request")
    })
  })
  test("404: Responds with an error if the article id is valid but does not exist in the database", () => {
    return request(app)
    .get("/api/articles/30902")
    .expect(404)
    .then(({ body }) => {
      expect(body.msg).toBe("Not found")
    })
  })
})

describe("GET /api/articles/:article_id/comments", () => {
  test("200: Responds with an object containing an array of comments corresponding to a specified article", () => {
    return request (app)
    .get("/api/articles/1/comments")
    .expect(200)
    .then(({ body }) => {
      const commentsList = body.comments;
      commentsList.forEach((comment) => {
        const { comment_id, votes, created_at, author, body, article_id } = comment
        expect(typeof comment_id).toBe("number")
        expect(typeof votes).toBe("number")
        expect(typeof created_at).toBe("string")
        expect(typeof author).toBe("string")
        expect(typeof body).toBe("string")
        expect(article_id).toBe(1)
      })
      expect(commentsList.length).not.toBe(0);
    })
  })
  test("400: Responds with an error if the article id is not valid", () => {
    return request(app)
    .get("/api/articles/caramelldansen/comments")
    .expect(400)
    .then(({ body }) => {
      expect(body.msg).toBe("Bad request")
    })
  })
  test("404: Responds with an error if the article id is valid but does not exist in the database", () => {
    return request(app)
    .get("/api/articles/1337/comments")
    .expect(404)
    .then(({ body }) => {
      expect(body.msg).toBe("Not found")
    })
  })
})

describe("POST /api/articles/:article_id/comments", () => {
  test("201: Posts a comment and responds with the posted comment", () => {
    return request(app)
    .post("/api/articles/2/comments")
    .send({
      username: "lurker",
      body: "How long have I been scrolling for!?"
    })
    .expect(201)
    .then(({ body }) => {
      const singleComment = body.comment;
      expect(typeof singleComment.comment_id).toBe("number")
      expect(singleComment.article_id).toBe(2)
      expect(typeof singleComment.body).toBe("string")
      expect(typeof singleComment.votes).toBe("number")
      expect(typeof singleComment.author).toBe("string")
      expect(typeof singleComment.created_at).toBe("string")
    })
  })
  test("400: Responds with an error when the request body has invalid fields", () => {
    return request(app)
    .post("/api/articles/3/comments")
    .send({trillionVotes: true})
    .expect(400)
    .then(({ body }) => {
      expect(body.msg).toBe("Bad request")
    })
  })
  test("400: Responds with an error when the request fields have invalid values", () => {
    return request(app)
    .post("/api/articles/5/comments")
    .send({username: "n0nExistentUser", body: "Trying to sneak in a comment from outside! >:3c"})
    .expect(400)
    .then(({ body }) => {
      expect(body.msg).toBe("Bad request")
    })  
  })
  test("400: Responds with an error if the article id is not valid", () => {
    return request(app)
    .get("/api/articles/caipirinha/comments")
    .send({username: "icellusedkars", body: "tasty :P"})
    .expect(400)
    .then(({ body }) => {
      expect(body.msg).toBe("Bad request")
    })
  })
  test("404: Responds with an error if the article id is valid but does not exist in the database", () => {
    return request(app)
    .get("/api/articles/9607/comments")
    .send({username: "butter_bridge", body: "BOOOOOOOO0000000000000000000!"})
    .expect(404)
    .then(({ body }) => {
      expect(body.msg).toBe("Not found")
    })
  })
})

describe("PATCH /api/articles/:article_id", () => {
  test("200: Patches the votes on an article and returns the updated article", () => {
    return request(app)
    .patch("/api/articles/1")
    .send({ inc_votes: -50 })
    .expect(200)
    .then(({ body }) => {
      const { article } = body;
      expect(typeof article.author).toBe("string")
      expect(typeof article.title).toBe("string")
      expect(article.article_id).toBe(1)
      expect(typeof article.body).toBe("string")
      expect(typeof article.topic).toBe("string")
      expect(typeof article.created_at).toBe("string")
      expect(article.votes).toBe(50)
      expect(typeof article.article_img_url).toBe("string")
    })
  })
  test("400: Responds with an error when the request body has invalid fields", () => {
    return request(app)
    .patch("/api/articles/2")
    .send({ approvalrating: 99})
    .expect(400)
    .then(({ body }) => {
      expect(body.msg).toBe("Bad request")
    })
  })
  test("400: Responds with an error when the request field has an invalid value", () => {
    return request(app)
    .patch("/api/articles/5")
    .send({inc_votes: "elephants"})
    .expect(400)
    .then(({ body }) => {
      expect(body.msg).toBe("Bad request")
    })
  })
  test("400: Responds with an error if the article id is not valid", () => {
    return request(app)
    .get("/api/articles/paffendorf/comments")
    .send({ inc_votes: 12})
    .expect(400)
    .then(({ body }) => {
      expect(body.msg).toBe("Bad request")
    })
  })
  test("404: Responds with an error if the article id is valid but does not exist in the database", () => {
    return request(app)
    .get("/api/articles/77777/comments")
    .send({inc_votes: -7})
    .expect(404)
    .then(({ body }) => {
      expect(body.msg).toBe("Not found")
    })
  })
})

describe("DELETE /api/comments/:comment_id", () => {
  test("204: Deletes the comment at the specified comment id", () => {
    return request(app)
    .delete("/api/comments/7")
    .expect(204)
    .then(({statusCode}) => {
      expect(statusCode).toBe(204)
    })
  })
  test("400: Responds with an error when trying to delete a comment referenced by an invalid id", () => {
    return request(app)
    .get("/api/articles/ievanpolkka/comments")
    .expect(400)
    .then(({ body }) => {
      expect(body.msg).toBe("Bad request")
    }) 
  })
  test("404: Responds with an error when trying to delete a comment that has a valid id but does not exist in the database", () => {
    return request(app)
    .get("/api/articles/98765/comments")
    .expect(404)
    .then(({ body }) => {
      expect(body.msg).toBe("Not found")
    })
  })
})