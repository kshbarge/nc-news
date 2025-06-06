const db = require("../db/connection")

const fetchTopics = () => {
    return db.query(`SELECT * FROM topics`).then(({rows}) => {
        return rows;
    })
}

const fetchArticles = () => {
    return db.query(`SELECT *
      FROM  (
          SELECT article_id, title, topic, author, created_at, votes, article_img_url
          FROM   articles
          )
      LEFT OUTER JOIN (
          SELECT article_id,
          COUNT(article_id) AS "comment_count"
          FROM comments
          GROUP BY article_id
          )
      USING (article_id)
      ORDER BY created_at DESC;`)
    .then(({rows}) => {
        rows.forEach((article) => {
            if (article.comment_count === null) {
                article.comment_count = 0;
            } else {
                article.comment_count = Number(article.comment_count);
            }
        })
        return rows;
    })
}

const fetchUsers = () => {
    return db.query(`SELECT * FROM users`).then(({rows}) => {
        return rows;
    })
}

const fetchSingleArticle = (id) => {
    return db.query(`SELECT * FROM articles WHERE article_id = $1`, [id]).then(({rows}) => {
        if(!rows.length){
          return Promise.reject({status: 404, msg: "Not found"});
          }
        const singleArticle = rows[0]
        return singleArticle;
    })
}

module.exports = { fetchTopics, fetchArticles, fetchUsers, fetchSingleArticle }