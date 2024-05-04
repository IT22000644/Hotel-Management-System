/* eslint-disable consistent-return */
import MaintenanceComplain from "../model/complains.model";
import logger from "../../utils/logger";

export const createComplain = async (req, res) => {
  try {
    const complain = new MaintenanceComplain(req.body);
    await complain.save();
    res.status(201).send(complain);
  } catch (error) {
    logger.error(error);
    res.status(400).send(error);
  }
};

export const getComplains = async (req, res) => {
  try {
    const complains = await MaintenanceComplain.find({}).populate(
      "user asset location"
    );
    res.send(complains);
  } catch (error) {
    logger.error(error);
    res.status(500).send(error);
  }
};

export const getComplain = async (req, res) => {
  try {
    const { id } = req.params;
    const complain = await MaintenanceComplain.findById(id).populate(
      "user asset location"
    );
    if (!complain) {
      return res.status(404).send();
    }
    res.send(complain);
  } catch (error) {
    logger.error(error);
    res.status(500).send(error);
  }
};

export const updateComplain = async (req, res) => {
  try {
    const { id } = req.params;
    const complain = await MaintenanceComplain.findByIdAndUpdate(id, req.body, {
      new: true,
    }).populate("user asset location");
    if (!complain) {
      return res.status(404).send();
    }
    res.send(complain);
  } catch (error) {
    logger.error(error);
    res.status(400).send(error);
  }
};

export const deleteComplain = async (req, res) => {
  try {
    const { id } = req.params;
    const complain = await MaintenanceComplain.findByIdAndDelete(id);
    if (!complain) {
      return res.status(404).send();
    }
    res.status(200).send(complain);
  } catch (error) {
    logger.error(error);
    res.status(500).send(error);
  }
};
