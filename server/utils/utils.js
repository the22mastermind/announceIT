// Return error messages
const returnError = (res, code, errorMessage) => res.status(code).json({
  status: code,
  error: errorMessage,
});

export default {
  returnError,
};
