const usersRouter = require("express").Router();

const usersController = require("../controllers/users.controller");

usersRouter.post("/create-new-user", usersController.createNewUser);

usersRouter.post("/add-favorite-product", usersController.postNewFavoriteProduct);

usersRouter.post("/send-account-verification-code", usersController.postAccountVerificationCode);

usersRouter.get("/login", usersController.login);

usersRouter.get("/user-info/:userId", usersController.getUserInfo);

usersRouter.get("/all-users", usersController.getAllUsers);

usersRouter.get("/favorite-products/:userId", usersController.getFavoriteProducts);

usersRouter.get("/forget-password", usersController.getForgetPassword);

usersRouter.put("/update-user-info/:userId", usersController.putUserInfo);

usersRouter.put("/update-verification-status", usersController.putVerificationStatus);

usersRouter.put("/reset-password/:userId", usersController.putResetPassword);

usersRouter.delete("/favorite-product", usersController.deleteProductFromFavoriteUserProducts);

module.exports = usersRouter;