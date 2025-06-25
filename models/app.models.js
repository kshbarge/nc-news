const db = require("../db/connection")

const fetchTopics = () => {
    return db.query(`SELECT * FROM topics`).then(({rows}) => {
        return rows;
    })
}

const doesTopicExist = (topic) => {
    return db.query('SELECT * FROM topics WHERE slug = $1', [topic])
    .then (({rows}) => {
      if (!rows.length) {
        return Promise.reject({status: 404, msg: 'Not found'});
        }
      }
    )
}

const fetchArticles = (sort_by, order, topic) => {
    const permittedQueriesSort_by = ["created_at", "votes", "title", "topic", "author"];
    const permittedQueriesOrder = ["asc", "desc"];
    const queryValues = [];
    let queryString = `SELECT *
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
      ORDER BY created_at DESC;`

    if (sort_by){
        if (!permittedQueriesSort_by.includes(sort_by)){
            return Promise.reject({ status: 400, msg: "Invalid query" });
        }
        queryString = queryString.replace("ORDER BY created_at", `ORDER BY ${sort_by}`)
    }

    if (order){
        if(!permittedQueriesOrder.includes(order)){
            return Promise.reject({ status: 400, msg: "Invalid query" });
        }
        queryString = queryString.replace("DESC", `${order.toUpperCase()}`)
    }

    if (topic){
        queryString = queryString.replace("USING (article_id)", `USING (article_id) WHERE topic = $1`) 
        queryValues.push(topic)
    }

    return db.query(queryString, queryValues)
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

const fetchArticleComments = (id) => {
    return db.query(`SELECT * FROM comments WHERE article_id = $1 ORDER BY created_at DESC`, [id]).then(({rows}) => {
        if(!rows.length){
          //run the checkArticleExists utils function
          return Promise.reject({status: 404, msg: "Not found"});
          }
        return rows;
    })
}

const addArticleComment = (username, body, id) => {
    return db.query(`INSERT INTO comments (author, body, article_id) VALUES ($1, $2, $3) RETURNING comment_id, article_id, body, votes, author, created_at;`, [username, body, id]).then(({rows}) => {
        const comment = rows[0]
        return comment;
    })
}

const updateArticleVotes = (voteChange = 0, id) => {
    return db.query(`UPDATE articles SET votes = votes + $1 WHERE article_id = $2 RETURNING *`, [voteChange, id]).then(({rows}) => {
        if(!rows.length){
            return Promise.reject({status:404, msg: "Not found"})
        }
        const selectedArticle = rows[0]
        console.log(selectedArticle)
        return selectedArticle;
    })
}

const destroyComment = (id) => {
    return db.query(`DELETE FROM comments WHERE comment_id = $1`, [id]).then(({rows}) => {
        return rows;
    })
}

module.exports = { fetchTopics, doesTopicExist, fetchArticles, fetchUsers, fetchSingleArticle, fetchArticleComments, addArticleComment, updateArticleVotes, destroyComment }