/* eslint-disable consistent-return */
/* eslint-disable no-underscore-dangle */
import Asset from "../model/asset.model";
import logger from "../../utils/logger";

export const createAsset = async (req, res) => {
  const assetData = req.body;
  const { filename } = req.file;
  logger.warn(filename);
  try {
    const asset = new Asset({ ...assetData, imageURL: filename });
    await asset.save();
    // eslint-disable-next-line no-underscore-dangle
    logger.info(`Asset with ID: ${asset._id} created.`);
    res.status(201).send(asset);
  } catch (error) {
    logger.error(`Create asset failed with error: ${error.message}`);
    res.status(500).send({ error: error.message });
  }
};

export const getAssets = async (req, res) => {
  try {
    const assets = await Asset.find({});
    res.send(assets);
  } catch (error) {
    logger.error(`Get assets failed with error: ${error.message}`);
    res.status(500).send({ error: error.message });
  }
};

export const getAsset = async (req, res) => {
  try {
    const asset = await Asset.findById(req.params.id);
    if (!asset) {
      return res.status(404).send();
    }
    res.send(asset);
  } catch (error) {
    logger.error(`Get asset failed with error: ${error.message}`);
    res.status(500).send({ error: error.message });
  }
};

export const updateAsset = async (req, res) => {
  try {
    if (req.file) {
      req.body.imageURL = req.file.filename;
    }

    const asset = await Asset.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!asset) {
      return res.status(404).send();
    }
    // eslint-disable-next-line no-underscore-dangle
    logger.info(`Asset with ID: ${asset._id} updated.`);
    res.send(asset);
  } catch (error) {
    logger.error(`Update asset failed with error: ${error.message}`);
    res.status(500).send({ error: error.message });
  }
};

export const deleteAsset = async (req, res) => {
  try {
    const asset = await Asset.findByIdAndDelete(req.params.id);
    if (!asset) {
      return res.status(404).send();
    }
    logger.info(`Asset with ID: ${asset._id} deleted.`);
    res.send(asset);
  } catch (error) {
    logger.error(`Delete asset failed with error: ${error.message}`);
    res.status(500).send({ error: error.message });
  }
};
