import multer from "multer";
import path from 'path';



const storage = multer.diskStorage({
 destination: path.join(__dirname, "../../public/uploads"),
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9 ) + path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix)
  }
})

const upload = multer({ storage: storage })

export default upload;
