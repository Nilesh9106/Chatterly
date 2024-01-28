const asyncHandler = require("express-async-handler");
const Message = require("../models/message");
const User = require("../models/user");
const Chat = require("../models/chat");

//@description     Get all Messages
//@route           GET /api/messages/:chatId
//@access          Protected
const allMessages = asyncHandler(async (req, res) => {
    try {
        Message.updateMany(
            { chat: req.params.chatId, readBy: { $ne: req.user._id } },
            { $addToSet: { readBy: req.user._id } }
        ).exec();
        const messages = await Message.find({ chat: req.params.chatId })
            .populate("sender", "_id name pic email")
            .populate("chat").populate("readBy", "_id name pic email");
        res.json(messages);
    } catch (error) {
        res.status(400);
        throw new Error(error.message);
    }
});

//@description     Create New Message
//@route           POST /api/messages/
//@access          Protected
const sendMessage = asyncHandler(async (req, res) => {
    const { content, chatId } = req.body;

    if (!content || !chatId) {
        console.log("Invalid data passed into request");
        return res.sendStatus(400);
    }

    var newMessage = {
        sender: req.user._id,
        message: content,
        chat: chatId,
        readBy: [req.user._id],
    };

    try {
        var message = await Message.create(newMessage);

        message = await message.populate("sender", "name pic");
        message = await message.populate("readBy", "name pic email");
        message = await message.populate("chat");

        await Chat.findByIdAndUpdate(req.body.chatId, { latestMessage: message });

        res.json(message);
    } catch (error) {
        res.status(400);
        throw new Error(error.message);
    }
});

const deleteMessage = asyncHandler(async (req, res) => {

    try {
        const message = await Message.findById(req.params.id);
        if (message.sender.toString() == req.user._id.toString()) {
            await Message.findByIdAndDelete(req.params.id);
            res.json({ message: 'Message removed' });
        } else {
            res.status(401);
            throw new Error('Not authorized to delete this message');
        }
    } catch (error) {
        res.status(400);
        throw new Error(error.message);
    }

});

module.exports = { allMessages, sendMessage, deleteMessage };