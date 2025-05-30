const db = require("../connection")
const format = require("pg-format")
const { convertTimestampToDate, topicDataConverter, createLookupObject } = require("./utils")

const seed = ({ topicData, userData, articleData, commentData }) => {
  return db.query(`DROP TABLE IF EXISTS comments`)
    .then(() => {
      return db.query(`DROP TABLE IF EXISTS articles`)
    })
    .then(() => {
      return db.query(`DROP TABLE IF EXISTS users`)
    })
    .then(() => {
      return db.query(`DROP TABLE IF EXISTS topics`)
    })
    .then(() => {
      return db.query(
      `CREATE TABLE topics (
      slug VARCHAR PRIMARY KEY,
      description VARCHAR,
      img_url VARCHAR(1000)
      );`
      );
    })
    .then(() => {
      return db.query(
      `CREATE TABLE users (
      username VARCHAR PRIMARY KEY,
      name VARCHAR,
      avatar_url VARCHAR(1000)
      );`
      );
    })
    .then(() => {
      return db.query(
      `CREATE TABLE articles (
      article_id SERIAL PRIMARY KEY,
      title VARCHAR,
      topic VARCHAR REFERENCES topics(slug) ON DELETE SET NULL,
      author VARCHAR REFERENCES users(username) ON DELETE SET NULL,
      body TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      votes INT DEFAULT 0,
      article_img_url VARCHAR(1000)
      );`
      );
    })
    .then(() => {
      return db.query(
      `CREATE TABLE comments (
      comment_id SERIAL PRIMARY KEY,
      article_id INT REFERENCES articles(article_id) ON DELETE SET NULL,
      body TEXT,
      votes INT DEFAULT 0,
      author VARCHAR REFERENCES users(username) ON DELETE SET NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );`
      );
    })
    //Don't touch above, that's the table creation sorted.
    .then(() => {
      return db.query(format("INSERT INTO topics (description, slug, img_url) VALUES %L", topicDataConverter(topicData)))
    })
    .then(() => {
      return db.query(format("INSERT INTO users (username, name, avatar_url) VALUES %L", topicDataConverter(userData)))
    })
    .then(() => {
      const convertedArticleData = articleData.map((article) => { return convertTimestampToDate(article)});
      const convertedAndFormattedTopicData = topicDataConverter(convertedArticleData);
      return db.query(format("INSERT INTO articles (created_at, title, topic, author, body, votes, article_img_url) VALUES %L RETURNING *", convertedAndFormattedTopicData))
    })
    .then((returnedArticlesInsert) => {
      const timestampFixedComments = commentData.map((comment) => { return convertTimestampToDate(comment)});
      const articleDataLookup = createLookupObject(returnedArticlesInsert.rows, "title", "article_id");
      const convertedCommentData = timestampFixedComments.map(({ created_at, article_title, body, votes, author }) => { return [ created_at, articleDataLookup[article_title], body, votes, author ]});
      return db.query(format("INSERT INTO comments (created_at, article_id, body, votes, author) VALUES %L", convertedCommentData))
    })
};
module.exports = seed;
