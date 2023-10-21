const usersRouter = require("express").Router();

const usersController = require("../controllers/users.controller");

usersRouter.post("/create-new-user", usersController.createNewUser);

usersRouter.post("/add-favorite-product", usersController.postNewFavoriteProduct);

usersRouter.get("/login", usersController.login);

usersRouter.get("/user-info/:userId", usersController.getUserInfo);

usersRouter.get("/all-users", usersController.getAllUsers);

usersRouter.get("/favorite-products/:userId", usersController.getFavoriteProducts);

usersRouter.put("/update-user-info/:userId", usersController.putUserInfo);

module.exports = usersRouter;