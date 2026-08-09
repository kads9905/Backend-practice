import multer from "multer"; 

// we are using disk storage here as storing it in temporarily on memory
// might lead to memory storage full when big files are uploaded
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // give destination folder to keep all the files to get full access
    // which is why we created gitkeep in public/temp
    cb(null, "./public/temp")
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' 
    + Math.round(Math.random() * 1E9)
    cb(null, file.originalname)
    // the storage method returns after multer is file name
    // u get the complete local path 
  }
})

export const upload = multer(
    { 
        storage,
})