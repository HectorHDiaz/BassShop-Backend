const express = require('express')
const multer = require('multer')
const { infoLogger, errorLogger } = require('../../utils/logger/index')

const fileRouter = express.Router()
//middleware
const storage = multer.diskStorage({
  destination: (req, file, cb) => { cb(null, 'views/uploads') },
  filename: (req, file, cb) => { cb(null, `${file.originalname}`) }
});

const upload = multer({ storage })

fileRouter.post('/image', upload.single('image'), (req, res, next) => {
  const filePath = req.file.path;
  if (!filePath) {
    const error = new Error('You must upload a file')
    error.httpStatusCode = 400
    return next(error);
  }
  infoLogger.info(filePath)
})

module.exports = fileRouter