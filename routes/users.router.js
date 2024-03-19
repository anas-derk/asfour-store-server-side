const usersRouter = require("express").Router();

const usersController = require("../controllers/users.controller");

const { validateJWT } = require("../middlewares/global.middlewares");

usersRouter.post("/create-new-user", usersController.createNewUser);

usersRouter.post("/add-favorite-product", validateJWT, usersController.postNewFavoriteProduct);

usersRouter.post("/send-account-verification-code", usersController.postAccountVerificationCode);

usersRouter.get("/login", usersController.login);

usersRouter.get("/login-with-google", usersController.loginWithGoogle);

usersRouter.get("/user-info", validateJWT, usersController.getUserInfo);

usersRouter.get("/all-users", usersController.getAllUsers);

usersRouter.get("/favorite-products-count", usersController.getFavoriteProductsCount);

usersRouter.get("/wallet-products-count", usersController.getWalletProductsCount);

usersRouter.get("/all-favorite-products-inside-the-page", usersController.getAllFavoriteProductsInsideThePage);

usersRouter.get("/all-wallet-products-inside-the-page", usersController.getAllWalletProductsInsideThePage);

usersRouter.get("/forget-password", usersController.getForgetPassword);

usersRouter.put("/update-user-info", validateJWT, usersController.putUserInfo);

usersRouter.put("/update-verification-status", usersController.putVerificationStatus);

usersRouter.put("/reset-password/:userId", usersController.putResetPassword);

usersRouter.delete("/favorite-product", validateJWT, usersController.deleteProductFromFavoriteUserProducts);

usersRouter.delete("/wallet-product", validateJWT, usersController.deleteProductFromUserProductsWallet);

module.exports = usersRouter;