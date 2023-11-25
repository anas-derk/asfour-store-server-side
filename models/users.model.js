// Import Mongoose And User Model Object

const { mongoose, userModel, productModel } = require("../models/all.models");

// require bcryptjs module for password encrypting

const bcrypt = require("bcryptjs");

// Define Create New User Function

async function createNewUser(email, password) {
    try {
        // Connect To DB
        await mongoose.connect(process.env.DB_URL);
        // Check If Email Is Exist
        const user = await userModel.findOne({ email });
        if (user) {
            await mongoose.disconnect();
            return "Sorry, Can't Create User Because it is Exist !!!";
        } else {
            // Create New Document From User Schema
            const newUser = new userModel({
                email,
                password: await bcrypt.hash(password, 10),
            });
            // Save The New User As Document In User Collection
            await newUser.save();
            // Disconnect In DB
            await mongoose.disconnect();
            return "Ok !!, Create New User Is Successfuly !!";
        }
    }
    catch (err) {
        // Disconnect In DB
        await mongoose.disconnect();
        throw Error(err);
    }
}

async function addNewFavoriteProduct(userId, productId) {
    try {
        // Connect To DB
        await mongoose.connect(process.env.DB_URL);
        // Check If Email Is Exist
        const user = await userModel.findById(userId);
        if (user) {
            const product = await productModel.findById(productId);
            if (product) {
                const favorite_productIndex = user.favorite_products_list.findIndex((favorite_product) => favorite_product._id == productId);
                if (favorite_productIndex == -1) {
                    await userModel.updateOne({ _id: userId } , { $push: { favorite_products_list: product } });
                    await mongoose.disconnect();
                    return "Ok !!, Adding New Favorite Product To This User Is Successfuly !!";
                }
                await mongoose.disconnect();
                return "Sorry, The Product Are Already Exist !!, Please Send Another Product Id ..";
            }
            await mongoose.disconnect();
            return "Sorry, The Product Is Not Exist !!, Please Send Another Product Id ..";
        }
        await mongoose.disconnect();
        return "Sorry, The User Is Not Exist !!, Please Send Another User Id ..";
    }
    catch (err) {
        // Disconnect In DB
        await mongoose.disconnect();
        throw Error(err);
    }
}

async function login(email, password) {
    try {
        // Connect To DB
        await mongoose.connect(process.env.DB_URL);
        // Check If Email Is Exist
        const user = await userModel.findOne({ email });
        if (user) {
            // Check From Password
            const isTruePassword = await bcrypt.compare(password, user.password);
            await mongoose.disconnect();
            if (isTruePassword) return user;
            else return "Sorry, Email Or Password Incorrect !!";
        }
        else {
            await mongoose.disconnect();
            return "Sorry, Email Or Password Incorrect !!";
        }
    }
    catch (err) {
        console.log(err);
        // Disconnect In DB
        await mongoose.disconnect();
        throw Error(err);
    }
}

async function getUserInfo(userId) {
    try {
        // Connect To DB
        await mongoose.connect(process.env.DB_URL);
        // Check If User Is Exist
        let user = await userModel.findById(userId);
        await mongoose.disconnect();
        if (user) return user;
        return "Sorry, The User Is Not Exist !!, Please Enter Another User Id ..";
    } catch (err) {
        // Disconnect In DB
        await mongoose.disconnect();
        throw Error(err);
    }
}

async function isExistUser(email) {
    try {
        // Connect To DB
        await mongoose.connect(process.env.DB_URL);
        // Check If User Is Exist
        let user = await userModel.findOne({ email });
        await mongoose.disconnect();
        if (user) return user;
        return "Sorry, The User Is Not Exist !!, Please Enter Another User Email ..";
    } catch (err) {
        // Disconnect In DB
        await mongoose.disconnect();
        throw Error(err);
    }
}

async function getAllUsers() {
    try {
        // Connect To DB
        await mongoose.connect(process.env.DB_URL);
        const users = await userModel.find({});
        await mongoose.disconnect();
        return users;
    } catch (err) {
        // Disconnect In DB
        await mongoose.disconnect();
        throw Error(err);
    }
}

async function getFavoriteProducts(userId) {
    try {
        // Connect To DB
        await mongoose.connect(process.env.DB_URL);
        // Check If User Is Exist
        const user = await userModel.findById(userId);
        await mongoose.disconnect();
        if (user) return user.favorite_products_list;
        return "Sorry, The User Is Not Exist !!, Please Enter Another User Id ..";
    } catch (err) {
        // Disconnect In DB
        await mongoose.disconnect();
        throw Error(err);
    }
}

async function updateUserInfo(userId, newUserData) {
    try {
        // Connect To DB
        await mongoose.connect(process.env.DB_URL);
        if (newUserData.password && newUserData.newPassword) {
            const userInfo = await userModel.findById(userId);
            if (userInfo) {
                const isTruePassword = await bcrypt.compare(newUserData.password, userInfo.password);
                if (isTruePassword) {
                    await userModel.updateOne({ _id: userId }, {
                        ...newUserData,
                        password: await bcrypt.hash(newUserData.newPassword, 10),
                    });
                    await mongoose.disconnect();
                    return "Updating User Info Process Has Been Successfuly ...";
                } else {
                    await mongoose.disconnect();
                    return "Sorry, This Password Is Uncorrect !!";
                }
            } else {
                await mongoose.disconnect();
                return "Sorry, Invalid User Id";
            }
        } else {
            await userModel.updateOne({ _id: userId }, {
                ...newUserData,
            });
            await mongoose.disconnect();
            return "Updating User Info Process Has Been Successfuly ...";
        }
    } catch (err) {
        // Disconnect In DB
        await mongoose.disconnect();
        throw Error(err);
    }
}

async function deleteProductFromFavoriteUserProducts(userId, productId) {
    try {
        // Connect To DB
        await mongoose.connect(process.env.DB_URL);
        // Check If Email Is Exist
        const user = await userModel.findById(userId);
        if (user) {
            const newFavoriteProductsList = user.favorite_products_list.filter((favorite_product) => favorite_product._id != productId);
            if (newFavoriteProductsList.length !== user.favorite_products_list.length) {
                await userModel.updateOne({ _id: userId } , { $set: { favorite_products_list: newFavoriteProductsList } });
                await mongoose.disconnect();
                return {
                    msg: "Ok !!, Deleting Favorite Product From This User Is Successfuly !!",
                    newFavoriteProductsList: newFavoriteProductsList,
                };
            }
            await mongoose.disconnect();
            return "Sorry, The Product Is Not Exist !!, Please Send Another Product Id ..";
        }
        await mongoose.disconnect();
        return "Sorry, The User Is Not Exist !!, Please Send Another User Id ..";
    }
    catch (err) {
        // Disconnect In DB
        await mongoose.disconnect();
        throw Error(err);
    }
}

module.exports = {
    createNewUser,
    addNewFavoriteProduct,
    login,
    getUserInfo,
    isExistUser,
    getAllUsers,
    getFavoriteProducts,
    updateUserInfo,
    deleteProductFromFavoriteUserProducts,
}