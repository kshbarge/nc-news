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



