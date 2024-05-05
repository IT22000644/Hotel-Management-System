const Guest = require("../model/guest.model");

//display
const getAllGuests = async (req, res) => {
  let Guests;
  //get all users
  try {
    Guests = await Guest.find();
  } catch (err) {
    console.log(err);
  }

  //not found
  if (!Guests) {
    return res.status(404).json({ message: "guest not Found" });
  }

  //display function
  return res.status(200).json({ Guests });
};

// insert

const addGuests = async (req, res, next) => {
  const {
    username,
    password,
    fullname,
    passportid,
    email,
    phone,
    language,
    contactmethod,
    country,
    health,
    payment,
    request,
  } = req.body;

  let guests;

  try {
    guests = new Guest({
      username,
      password,
      fullname,
      passportid,
      email,
      phone,
      language,
      contactmethod,
      country,
      health,
      payment,
      request,
    });
    await guests.save();
  } catch (err) {
    console.log(err);
  }
  //not insert
  if (!guests) {
    return res.status(404).send({ message: "unable to add guests" });
  }
  return res.status(200).json({ guests });
};

//get by id

const getById = async (req, res, next) => {
  const id = req.params.id;

  let guest;

  try {
    guest = await Guest.findById(id);
  } catch (err) {
    console.log(err);
  }
  //not avaliable
  if (!guest) {
    return res.status(404).send({ message: "guest not found" });
  }
  return res.status(200).json({ guest });
};

//update

const updateGuests = async (req, res, next) => {
  const id = req.params.id;
  const {
    username,
    password,
    fullname,
    passportid,
    email,
    phone,
    language,
    contactmethod,
    country,
    health,
    payment,
    request,
  } = req.body;

  let guests;

  try {
    guests = await Guest.findByIdAndUpdate(id, {
      username,
      password,
      fullname,
      passportid,
      email,
      phone,
      language,
      contactmethod,
      country,
      health,
      payment,
      request,
    });
    guests = await guests.save();
  } catch (err) {
    console.log(err);
  }
  //not avaliable
  if (!guests) {
    return res.status(404).send({ message: "unable to update guests" });
  }
  return res.status(200).json({ guests });
};

//delete
const deleteGuests = async (req, res, next) => {
  const id = req.params.id;

  let guest;

  try {
    guest = await Guest.findByIdAndDelete(id);
  } catch (err) {
    console.log(err);
  }
  //not avaliable
  if (!guest) {
    return res.status(404).send({ message: "unable to delete guests" });
  }
  return res.status(200).json({ guest });
};

//--------------------------------------------------------------------------------------------------------------

// Login function
// const login = async (req, res, next) => {
//     const { passportId, password } = req.body;

//     try {
//         // Find the guest by passportId
//         const guest = await Guest.findOne({ passportId });

//         // If guest not found, return error
//         if (!guest) {
//             return res.status(401).json({ message: "Invalid credentials" });
//         }

//         // Compare passwords
//         const isMatch = await bcrypt.compare(password, guest.password);

//         // If passwords don't match, return error
//         if (!isMatch) {
//             return res.status(401).json({ message: "Invalid credentials" });
//         }

//         // Passwords match, generate JWT token or any other authentication token
//         // For simplicity, let's just return success for now
//         return res.status(200).json({ message: "Login successful" });
//     } catch (error) {
//         console.error("Error during login:", error);
//         return res.status(500).json({ message: "Internal server error" });
//     }
// };

const login = async (req, res, next) => {
  const { passportid, password } = req.body;

  try {
    // Find the guest with the given passportid and password
    const guest = await Guest.findOne({ passportid, password });

    if (!guest) {
      return res
        .status(401)
        .json({ message: "Invalid passportid or password" });
    }

    // Return username and userId upon successful login
    res.status(200).json({
      username: guest.username,
      userId: guest._id,
      passportid: guest.passportid,
    });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getReservations = async (req, res, next) => {
  const passportid = req.params.passportid;
  //const passportid = req.headers.passportid;

  try {
    // Fetch reservations associated with the given passport ID
    const reservations = await Reservation.find({ passportid });

    res.status(200).json({ reservations });
  } catch (error) {
    console.error("Error fetching reservations:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
1;

exports.getAllGuests = getAllGuests;
exports.addGuests = addGuests;
exports.getById = getById;
exports.updateGuests = updateGuests;
exports.deleteGuests = deleteGuests;

exports.getReservations = getReservations;

exports.login = login;
