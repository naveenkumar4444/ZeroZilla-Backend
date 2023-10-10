async function ErrorMiddleWare(error, req, res, next) {
  const success = error.success || false;
  const status = error.status || 500;
  const message = error.message || "Something Went Wrong";
  res.status(status).send({
    success,
    status,
    message,
  });
}

module.exports = ErrorMiddleWare;
