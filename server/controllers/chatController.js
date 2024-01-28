const asyncHandler = require("express-async-handler");
const Chat = require("../models/chat");
const User = require("../models/user");
const Message = require("../models/message");
//@description     Create or fetch One to One Chat
//@route           POST /api/chat/
//@access          Protected
const accessChat = asyncHandler(async (req, res) => {
    const { userId } = req.body;
    let receiver = await User.findById(userId);
    if (!userId) {
        console.log("UserId param not sent with request");
        return res.sendStatus(400);
    }

    var isChat = await Chat.find({
        isGroupChat: false,
        $and: [
            { users: { $elemMatch: { $eq: req.user._id } } },
            { users: { $elemMatch: { $eq: userId } } },
        ],
    })
        .populate("users", "-password")
        .populate("latestMessage");

    isChat = await User.populate(isChat, {
        path: "latestMessage.sender",
        select: "name pic email",
    });

    if (isChat.length > 0) {
        res.send(isChat[0]);
    } else {
        var chatData = {
            chatName: receiver.name,
            isGroupChat: false,
            users: [req.user._id, userId],
        };

        try {
            const createdChat = await Chat.create(chatData);
            const FullChat = await Chat.findOne({ _id: createdChat._id }).populate(
                "users",
                "-password"
            );
            res.status(200).json(FullChat);
        } catch (error) {
            res.status(400);
            throw new Error(error.message);
        }
    }
});

//fetch chat

const fetchChat = asyncHandler(async (req, res) => {
    const chatId = req.params.chatId;
    console.log(chatId);
    try {
        const chat = await Chat.findById(chatId)
            .populate("users", "-password")
            .populate("latestMessage");

        res.status(200).json(chat);
    } catch (error) {
        res.status(400);
        throw new Error(error.message);
    }
});

//@description     Fetch all chats for a user
//@route           GET /api/chat/
//@access          Protected
const fetchChats = asyncHandler(async (req, res) => {
    try {
        Chat.find({ users: { $elemMatch: { $eq: req.user._id } } })
            .populate("users", "-password")
            .populate("groupAdmin", "-password")
            .populate("latestMessage")
            .sort({ updatedAt: -1 })
            .then(async (results) => {
                results = await User.populate(results, {
                    path: "latestMessage.sender",
                    select: "name pic email",
                });
                res.status(200).send(results);
            });
    } catch (error) {
        res.status(400);
        throw new Error(error.message);
    }
});

//@description     Create New Group Chat
//@route           POST /api/chat/group
//@access          Protected
const createGroupChat = asyncHandler(async (req, res) => {
    if (!req.body.users || !req.body.name) {
        return res.status(400).send({ message: "Please Fill all the fields" });
    }
    let users1 = req.body.users;
    if (users1.length < 2) {
        return res
            .status(400)
            .send("More than 2 users are required to form a group chat");
    }

    users1.push(req.user);

    let users = users1.sort();
    // console.log(users);

    try {
        const isChat = await Chat.findOne({
            isGroupChat: true,
            users: { $all: users },
        }).populate("users", "-password")
            .populate("groupAdmin", "-password");
        if (isChat.length > 0) {
            return res.status(200).send(isChat);
        }
        const groupChat = await Chat.create({
            chatName: req.body.name,
            users: users,
            isGroupChat: true,
            groupAdmin: req.user,
        });

        const fullGroupChat = await Chat.findOne({ _id: groupChat._id })
            .populate("users", "-password")
            .populate("groupAdmin", "-password");

        res.status(200).json(fullGroupChat);
    } catch (error) {
        res.status(400);
        throw new Error(error.message);
    }
});

// @desc    Rename Group
// @route   PUT /api/chat/:chatId
// @access  Protected
const renameGroup = asyncHandler(async (req, res) => {
    const chatId = req.params.chatId;

    const chat = await Chat.findById(chatId);
    if (req.user._id.toString() !== chat.groupAdmin.toString()) {
        res.status(401);
        throw new Error("You are not authorized to rename this chat");
    }

    const updatedChat = await Chat.findByIdAndUpdate(
        chatId,
        req.body,
        {
            new: true,
        }
    )
        .populate("users", "-password")
        .populate("groupAdmin", "-password");

    if (!updatedChat) {
        res.status(404);
        throw new Error("Chat Not Found");
    } else {
        res.json(updatedChat);
    }
});

// @desc    Remove user from Group
// @route   PUT /api/chat/groupremove
// @access  Protected
const removeFromGroup = asyncHandler(async (req, res) => {
    const { chatId, userId } = req.body;

    // check if the requester is admin
    const chat = await Chat.findById(chatId);
    if (req.user._id.toString() !== chat.groupAdmin.toString() && req.user._id.toString() !== userId) {
        res.status(401);
        throw new Error("You are not authorized to remove users from this chat");
    }

    const removed = await Chat.findByIdAndUpdate(
        chatId,
        {
            $pull: { users: userId },
        },
        {
            new: true,
        }
    )
        .populate("users", "-password")
        .populate("groupAdmin", "-password");

    if (!removed) {
        res.status(404);
        throw new Error("Chat Not Found");
    } else {
        res.json(removed);
    }
});

// @desc    Add user to Group / Leave
// @route   PUT /api/chat/groupadd
// @access  Protected
const addToGroup = asyncHandler(async (req, res) => {
    console.log(req.body);
    const { chatId, userId } = req.body;

    // check if the requester is admin
    const chat = await Chat.findById(chatId);
    if (req.user._id.toString() !== chat.groupAdmin.toString()) {
        res.status(401);
        throw new Error("You are not authorized to add users to this chat");
    }

    const added = await Chat.findByIdAndUpdate(
        chatId,
        {
            $push: { users: userId },
        },
        {
            new: true,
        }
    )
        .populate("users", "-password")
        .populate("groupAdmin", "-password");

    if (!added) {
        res.status(404);
        throw new Error("Chat Not Found");
    } else {
        res.json(added);
    }
});

// @desc    Add user to Group / Leave
// @route   DELETE /api/chats/:chatId
// @access  Protected
const deleteChat = asyncHandler(async (req, res) => {
    const chatId = req.params.chatId;

    // check if the requester is admin
    try {
        const chat = await Chat.findById(chatId);
        if (chat.isGroupChat && req.user._id.toString() !== chat.groupAdmin.toString()) {
            res.status(401);
            throw new Error("You are not authorized to delete this chat");
        }
        await Message.deleteMany({ chat: chatId });

        await Chat.deleteOne({ _id: chatId });
        res.send(chat);
    } catch (error) {
        throw new Error(error.message);
    }
});

module.exports = {
    accessChat,
    fetchChat,
    fetchChats,
    createGroupChat,
    renameGroup,
    addToGroup,
    removeFromGroup,
    deleteChat
};