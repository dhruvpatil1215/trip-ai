const errorHandler = (err, req, res, next) => {
  // Set status code (default to 500 if not set or is 200)
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  
  console.error("Global Error Handler Catch:", err.message);

  res.status(statusCode).json({
    success: false,
    message: err.message || "An unexpected server error occurred",
    stack: process.env.NODE_ENV === "production" ? null : err.stack,
  });
};

module.exports = { errorHandler };
