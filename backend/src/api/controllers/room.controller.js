import logger from "../../utils/logger";
import Room from "../model/room.model";

export const getAllRooms = async (req, res) => {
  let Rooms;

  try {
    Rooms = await Room.find();
  } catch (err) {
    logger.log(err);
  }

  //not found
  if (!Rooms) {
    return res.status(404).json({ message: "Room not Found" });
  }

  //display function
  return res.status(200).json({ Rooms });
};

// insert
export const addRooms = async (req, res) => {
  const { roomno, floor, type, noofbeds, balcony, ac } = req.body;

  let rooms;

  try {
    rooms = new Room({ roomno, floor, type, noofbeds, balcony, ac });
    await rooms.save();
  } catch (err) {
    console.log(err);
  }
  //not insert
  if (!rooms) {
    return res.status(404).send({ message: "unable to add room" });
  }
  return res.status(200).json({ rooms });
};

//get by id
export const getById = async (req, res, next) => {
  const id = req.params.id;

  let room;

  try {
    room = await Room.findById(id);
  } catch (err) {
    console.log(err);
  }
  //not avaliable
  if (!room) {
    return res.status(404).send({ message: "rooms not found" });
  }
  return res.status(200).json({ room });
};

//update
export const updateRooms = async (req, res) => {
  const id = req.params.id;
  const { roomno, floor, type, noofbeds, balcony, ac } = req.body;

  let rooms;

  try {
    rooms = await Room.findByIdAndUpdate(id, {
      roomno,
      floor,
      type,
      noofbeds,
      balcony,
      ac,
    });
    rooms = await rooms.save();
  } catch (err) {
    logger.log(err);
  }

  if (!rooms) {
    return res.status(404).send({ message: "unable to update rooms" });
  }
  return res.status(200).json({ rooms });
};

export const deleteRooms = async (req, res) => {
  const id = req.params.id;

  let room;

  try {
    room = await Room.findByIdAndDelete(id);
  } catch (err) {
    logger.log(err);
  }
  //not avaliable
  if (!room) {
    return res.status(404).send({ message: "unable to delete room" });
  }
  return res.status(200).json({ room });
};
