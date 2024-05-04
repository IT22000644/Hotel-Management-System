import { Router } from "express";
import {
  createAsset,
  getAssets,
  getAsset,
  updateAsset,
  deleteAsset,
} from "../controllers/asset.controller";
import uploadImage from "../middleware/uploadImage";

const assetRouter = Router();

assetRouter.post("/", uploadImage("asset"), createAsset);
assetRouter.get("/", getAssets);
assetRouter.get("/:id", getAsset);
assetRouter.put("/:id", uploadImage("asset"), updateAsset);
assetRouter.delete("/:id", deleteAsset);

export default assetRouter;
