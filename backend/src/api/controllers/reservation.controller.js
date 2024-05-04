/* eslint-disable consistent-return */
import Reservation from "../model/reservation.model";
import Table from "../model/table.model";
import logger from "../../utils/logger";

export const createReservation = async (req, res) => {
  try {
    const date = new Date(req.body.date);
    const startTime = new Date(`${req.body.date}T${req.body.startTime}:00Z`);
    const endTime = new Date(`${req.body.date}T${req.body.endTime}:00Z`);

    logger.warn(startTime.getTime());

    if (Number.isNaN(startTime.getTime()) || Number.isNaN(endTime.getTime())) {
      throw new Error("Invalid date or time format");
    }

    const reservation = new Reservation({
      ...req.body,
      date,
      startTime,
      endTime,
    });

    await reservation.save();
    res.status(201).send(reservation);
  } catch (error) {
    logger.error(error);
    res.status(400).send({ error: error.message });
  }
};

export const getReservations = async (req, res) => {
  try {
    const reservations = await Reservation.find({}).populate("tableNumber");
    res.send(reservations);
  } catch (error) {
    logger.error(error);
    res.status(500).send(error);
  }
};

export const getReservation = async (req, res) => {
  try {
    const { id } = req.params;
    const reservations = await Reservation.find({ tableNumber: id }).populate(
      "tableNumber"
    );
    logger.warn(id);
    if (!reservations.length) {
      return res.status(404).send();
    }
    res.send(reservations);
  } catch (error) {
    logger.error(error);
    res.status(500).send(error);
  }
};

export const patchReservation = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = { ...req.body };
    if (req.body.date) {
      updates.date = new Date(req.body.date);
    }
    if (req.body.startTime) {
      updates.startTime = new Date(
        `${req.body.date}T${req.body.startTime}:00Z`
      );
    }
    if (req.body.endTime) {
      updates.endTime = new Date(`${req.body.date}T${req.body.endTime}:00Z`);
    }
    const reservation = await Reservation.findByIdAndUpdate(id, updates, {
      new: true,
    }).populate("tableNumber");
    if (!reservation) {
      return res.status(404).send();
    }
    res.status(200).send(reservation);
  } catch (error) {
    res.status(400).send(error);
  }
};

export const deleteReservation = async (req, res) => {
  try {
    const { id } = req.params;
    const reservation = await Reservation.findByIdAndDelete(id);
    if (!reservation) {
      return res.status(404).send();
    }
    res.status(200).send();
  } catch (error) {
    logger.error(error);
    res.status(500).send(error);
  }
};

export const getTablesInTimeRange = async (req, res) => {
  const { date, startTime, endTime } = req.params;

  const startDateTime = new Date(`${date}T${startTime}:00Z`);
  const endDateTime = new Date(`${date}T${endTime}:00Z`);

  logger.warn(startDateTime, endDateTime);

  if (startDateTime >= endDateTime) {
    return res
      .status(400)
      .send({ error: "startTime must be less than endTime" });
  }

  try {
    const reservations = await Reservation.find({
      date,
      $or: [
        { startTime: { $lt: endDateTime, $gte: startDateTime } },
        { endTime: { $gt: startDateTime, $lte: endDateTime } },
        { startTime: { $lte: startDateTime }, endTime: { $gte: endDateTime } },
      ],
    }).populate("tableNumber");

    const reservedTables = reservations.map(
      // eslint-disable-next-line no-underscore-dangle
      reservation => reservation.tableNumber._id
    );

    const availableTables = await Table.find({ _id: { $nin: reservedTables } });

    res.status(200).send(availableTables);
  } catch (error) {
    logger.error(error);
    res.status(500).send(error);
  }
};
