const { consoleLogger , errorLogger } = require("../utils/logger");

function errorHandler(error, req, res, next) {
  errorLogger.error(error)
  consoleLogger.error(error)
  res.status(500);
  res.render('errorpage.ejs',  {error} );
}

module.exports = {errorHandler}