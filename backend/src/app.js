import "dotenv/config";
import express from "express";
import cors from "cors";
import logger from "./utils/logger";
import connect from "./utils/database.connection";
import foodItemRouter from "./api/routes/foodItem.route";
import menuRouter from "./api/routes/menu.route";
import orderRouter from "./api/routes/order.route";
import restaurantInventoryRouter from "./api/routes/restaurantInventory.route";
import maintenanceTaskRouter from "./api/routes/maintenanceTask.route";
import customerRouter from "./api/routes/customer.route";
import userRouter from "./api/routes/user.route";
import reportRouter from "./api/routes/report.route";
import assetRouter from "./api/routes/asset.route";
import reservationRouter from "./api/routes/reservation.route";
import tableRouter from "./api/routes/table.route";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: "20mb" }));

app.get("/", (req, res) => {
  res.send(`Welcome to the backend!`);
});

app.post("/", (req, res) => {
  res.send(`post request to the homepage`);
});

/* Reservation */

app.use("/food-item", foodItemRouter);
app.use("/menu", menuRouter);
app.use("/order", orderRouter);
app.use("/restaurant-inventory", restaurantInventoryRouter);
app.use("/table-reservation", reservationRouter);
app.use("/table", tableRouter);

/* Maintenance */
app.use("/task", maintenanceTaskRouter);
app.use("/asset", assetRouter);
app.use("/customer", customerRouter);
app.use("/user", userRouter);

/* Reports */
app.use("/report", reportRouter);

app.use("/uploads", express.static("uploads"));

app.listen(PORT, () => {
  logger.info(`Server is up and running on port ${PORT}`);
  connect();
});
