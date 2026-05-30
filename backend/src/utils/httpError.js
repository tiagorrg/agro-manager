function createHttpError(status, code, message, details) {
  const error = new Error(message);
  error.status = status;
  error.code = code;
  error.details = details || null;
  return error;
}

module.exports = {
  createHttpError,
};
