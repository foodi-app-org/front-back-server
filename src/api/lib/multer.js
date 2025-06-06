import path from 'path'

import multer from 'multer'
// import uuid from 'uuid/v4';
const storage = multer.diskStorage({
  destination: 'uploads',
  filename: (req, file, cb) => {
    cb(null, `${new Date().getTime() + path.extname(file.originalname)}`)
  }
})
export default multer({ storage })
