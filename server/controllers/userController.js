const asyncHandler = require("express-async-handler");
const User = require("../models/user");
const generateToken = require("../middlewares/generateToken");

//@description     Get or Search all users
//@route           GET /api/user?search=
//@access          Protected
const allUsers = asyncHandler(async (req, res) => {
    const keyword = req.query.search
        ? {
            _id: { $ne: req.user._id },
            $or: [
                { name: { $regex: req.query.search, $options: "i" } },
                { email: { $regex: req.query.search, $options: "i" } },
            ],
        }
        : { _id: { $ne: req.user._id } };

    const users = await User.find(keyword).select("-password");
    res.send(users);
});

//@description     Update user
//@route           PUT /api/users/:id
//@access          Protected
const updateUser = asyncHandler(async (req, res) => {
    const id = req.params.id;

    try {
        if (req.user._id.toString() !== id.toString()) {
            res.status(401);
            throw new Error("You can update only your account");
        }
        const user = await User.findByIdAndUpdate(id, req.body, { new: true }).select("-password");
        res.send(user);
    } catch (error) {
        res.status(400);
        throw new Error(error.message);
    }
});


//@description     Delete user
//@route           DELETE /api/users/:id
//@access          Protected
const deleteUser = asyncHandler(async (req, res) => {
    const id = req.params.id;

    try {
        if (req.user._id.toString() !== id.toString()) {
            res.status(401);
            throw new Error("You can delete only your account");
        }
        await User.findByIdAndDelete(id);
        res.send("User Deleted");
    } catch (error) {
        res.status(400);
        throw new Error(error.message);
    }
});

//@description     Register new user
//@route           POST /api/user/
//@access          Public
const registerUser = asyncHandler(async (req, res) => {
    const { name, email, password, pic } = req.body;

    if (!name || !email || !password) {
        res.status(400);
        throw new Error("Please Enter all the fields");
    }

    const userExists = await User.findOne({ email });

    if (userExists) {
        res.status(400);
        throw new Error("User already exists");
    }

    const user = await User.create({
        name,
        email,
        password,
        pic,
    });

    if (user) {
        res.status(200).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            pic: user.pic,
            token: generateToken(user._id),
        });
    } else {
        res.status(400);
        throw new Error("User not found");
    }
});

//@description     Auth the user
//@route           POST /api/users/login
//@access          Public
const authUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            pic: user.pic,
            token: generateToken(user._id),
        });
    } else {
        res.status(400);
        throw new Error("Invalid Email or Password");
    }
});

module.exports = { allUsers, registerUser, authUser, updateUser, deleteUser };