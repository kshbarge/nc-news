const handleCustomErrors = (err, req, res, next) => {
    if (err.status) {
    res.status(err.status).send({ msg: err.msg });
  } else next(err);
}

const handlePostgresErrors = (err, req, res, next) => {
    if (err.code === "22P02" || err.code === "23503") {
    res.status(400).send({ msg: "Bad request" });
  } else next(err);
}

const handleServerErrors = (err, req, res, next) => {
    console.log(err);
    res.status(500).send({ msg: "Internal Server Error" });
}


module.exports = { handleCustomErrors, handlePostgresErrors, handleServerErrors }