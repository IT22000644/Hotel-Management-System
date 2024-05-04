import Menu from "../model/menu.model";
import RestaurantInventoryItem from "../model/restaurantInventory.model";
import logger from "../../utils/logger";

export const createMenu = async (req, res) => {
  try {
    const newMenu = new Menu({ ...req.body, imageUrl: req.file.filename });

    const savedMenu = await newMenu.save();

    return res.status(200).json(savedMenu);
  } catch (err) {
    logger.error(err.message);
    return res.status(500).json({ error: err.message });
  }
};

export const getMenus = async (req, res) => {
  try {
    const menus = await Menu.find();
    return res.status(200).json(menus);
  } catch (err) {
    logger.error(err.message);
    return res.status(500).json({ error: err.message });
  }
};

export const putMenu = async (req, res) => {
  const { id } = req.params;

  try {
    const updatedMenu = await Menu.findByIdAndUpdate(
      id,
      {
        ...req.body,
      },
      { new: true }
    );

    if (!updatedMenu) {
      return res.status(404).json({ error: "Menu not found" });
    }

    return res.status(200).json(updatedMenu);
  } catch (err) {
    logger.error(err.message);
    return res.status(500).json({ error: err.message });
  }
};

export const getMenu = async (req, res) => {
  try {
    const menu = await Menu.findById(req.params.id)
      .populate("foodItems")
      .exec();

    const populateQuantity = async foodItem => {
      // eslint-disable-next-line no-underscore-dangle
      const inventoryItem = await RestaurantInventoryItem.findOne({
        // eslint-disable-next-line no-underscore-dangle
        foodItem: foodItem._id,
      });
      // eslint-disable-next-line no-underscore-dangle, no-param-reassign
      foodItem._doc.quantity = inventoryItem ? inventoryItem.quantity : 0;
    };

    await Promise.all(menu.foodItems.map(populateQuantity));

    res.json(menu);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const deleteMenu = async (req, res) => {
  try {
    const { id } = req.params; // Get the id from the request parameters
    const menu = await Menu.findOneAndDelete({ _id: id }); // Find the menu by id and remove it

    if (!menu) {
      return res.status(404).json({ error: "Menu not found" });
    }

    return res.status(200).json({ message: "Menu deleted successfully" });
  } catch (err) {
    logger.error(err.message);
    return res.status(500).json({ error: err.message });
  }
};
