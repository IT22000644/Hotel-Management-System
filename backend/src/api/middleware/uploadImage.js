import multer from "multer";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import logger from "../../utils/logger";

const uploadImage = folder => {
  const storage = multer.diskStorage({
    destination(req, file, cb) {
      cb(null, `uploads/${folder}`);
    },
    filename(req, file, cb) {
      const uniquePrefix = uuidv4();
      cb(
        null,
        `${uniquePrefix}-${Date.now()}${path.extname(file.originalname)}`
      );
    },
  });

  const upload = multer({ storage }).single("image");

  return (req, res, next) => {
    // eslint-disable-next-line consistent-return
    upload(req, res, err => {
      if (err instanceof multer.MulterError) {
        // A Multer error occurred when uploading.
        logger.error(err);
        return next(err);
      }
      if (err) {
        logger.error(err);
        return next(err);
      }

      // Everything went fine.
      // You can add additional logic here if needed.

      // Pass control to the next middleware.
      next();
    });
  };
};

export default uploadImage;
