import Reservation from "../model/reservation.model";
import logger from "../../utils/logger";

export const createReservation = async (req, res) => {
  try {
    const reservation = new Reservation({
      ...req.body,
      // eslint-disable-next-line no-underscore-dangle
      tableNumber: req.body.tableNumber._id,
    });
    await reservation.save();
    res.status(201).send(reservation);
  } catch (error) {
    logger.error(error);
    res.status(400).send(error);
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

// eslint-disable-next-line consistent-return
export const getReservation = async (req, res) => {
  try {
    const { id } = req.params.id;
    const reservation = await Reservation.findById(id).populate("tableNumber");
    if (!reservation) {
      return res.status(404).send();
    }
    res.send(reservation);
  } catch (error) {
    logger.error(error);
    res.status(500).send(error);
  }
};

// eslint-disable-next-line consistent-return
export const patchReservation = async (req, res) => {
  try {
    const { id } = req.params.id;
    const reservation = await Reservation.findByIdAndUpdate(id, req.body, {
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

// eslint-disable-next-line consistent-return
export const deleteReservation = async (req, res) => {
  try {
    const { id } = req.params.id;
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

// eslint-disable-next-line consistent-return
export const getTablesInTimeRange = async (req, res) => {
  const { date, startTime, endTime } = req.params;

  // Check if startTime is less than endTime
  if (new Date(startTime) >= new Date(endTime)) {
    return res
      .status(400)
      .send({ error: "startTime must be less than endTime" });
  }

  try {
    const reservations = await Reservation.find({
      date,
      time: {
        $gte: startTime,
        $lte: endTime,
      },
    }).populate("tableNumber");

    const tables = reservations.map(reservation => reservation.tableNumber);
    res.status(200).send(tables);
  } catch (error) {
    logger.error(error);
    res.status(500).send(error);
  }
};
