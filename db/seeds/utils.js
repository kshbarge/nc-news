const db = require("../../db/connection");

exports.convertTimestampToDate = ({ created_at, ...otherProperties }) => {
  if (!created_at) return { ...otherProperties };
  return { created_at: new Date(created_at), ...otherProperties };
};

//^Don't touch above, this util was pre-created and works!^

exports.topicDataConverter = (topicData) => {
  let formattedData = [];
  for (let i = 0; i < topicData.length; i++){
    formattedData.push(Object.values(topicData[i]));
  }
  return formattedData;
};

exports.createLookupObject = (objects, key, val) => {
  let lookupObject = {}
  const copiedArray = [...objects];
  copiedArray.forEach((object) => {
    return lookupObject[object[key]] = object[val];
  })
  return lookupObject;
};

exports.checkArticleExists = (id) => {
  return db.query(`SELECT * FROM articles WHERE article_id = $1`, [id]).then(({rows}) => {
    if (!rows.length){
      return Promise.reject({status: 404, msg: "Not found"});
      }
    return []
    })
}

