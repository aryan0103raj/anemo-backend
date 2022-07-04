const multer = require("multer");
const GridFsStorage = require("multer-gridfs-storage").GridFsStorage;

const uri =
  "mongodb+srv://aryan:aryan@anemo.3kbza5o.mongodb.net/?retryWrites=true&w=majority";

const storage = new GridFsStorage({
  url: uri,
  options: { useNewUrlParser: true, useUnifiedTopology: true },
  file: (req, file) => {
    const match = ["image/png", "image/jpeg"];

    if (match.indexOf(file.mimetype) === -1) {
      const filename = `${Date.now()}-any-name-${file.originalname}`;
      return filename;
    }

    return {
      bucketName: "photos",
      filename: `${Date.now()}-any-name-${file.originalname}`,
    };
  },
});

module.exports = multer({ storage });
