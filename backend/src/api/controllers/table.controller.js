import Table from "../model/table.model";
import logger from "../../utils/logger";

export const createTable = async (req, res) => {
  try {
    const table = new Table(req.body);
    await table.save();
    res.status(201).send(table);
  } catch (error) {
    logger.error(error);
    res.status(400).send(error);
  }
};

export const getTables = async (req, res) => {
  try {
    const tables = await Table.find({});
    res.send(tables);
  } catch (error) {
    logger.error(error);
    res.status(500).send(error);
  }
};

// eslint-disable-next-line consistent-return
export const getTable = async (req, res) => {
  try {
    const { id } = req.params;
    const table = await Table.findById(id);
    if (!table) {
      return res.status(404).send();
    }
    res.send(table);
  } catch (error) {
    logger.error(error);
    res.status(500).send(error);
  }
};

// eslint-disable-next-line consistent-return
export const updateTable = async (req, res) => {
  try {
    const { id } = req.params;
    const table = await Table.findByIdAndUpdate(id, req.body, { new: true });
    if (!table) {
      return res.status(404).send();
    }
    res.send(table);
  } catch (error) {
    logger.error(error);
    res.status(400).send(error);
  }
};

// eslint-disable-next-line consistent-return
export const deleteTable = async (req, res) => {
  try {
    const { id } = req.params;
    const table = await Table.findByIdAndDelete(id);
    if (!table) {
      return res.status(404).send();
    }
    res.status(200).send(table);
  } catch (error) {
    logger.error(error);
    res.status(500).send(error);
  }
};
