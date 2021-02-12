exports.fResponse = (statusCode, options) => ({
  statusCode,
  body: JSON.stringify({ ...options }),
});
