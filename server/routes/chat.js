const express = require("express");
const {
    accessChat,
    fetchChat,
    fetchChats,
    createGroupChat,
    removeFromGroup,
    addToGroup,
    renameGroup,
    deleteChat,

} = require("../controllers/chatController");
const { protect } = require("../middlewares/authMiddleware");

const router = express.Router();

// Create or fetch One to One Chat
router.route("/").post(protect, accessChat);
// Fetch All Chats
router.route("/").get(protect, fetchChats);
// Create Group Chat
router.route("/group").post(protect, createGroupChat);
// Rename Group Chat
// Remove User from Group
router.route("/groupremove").put(protect, removeFromGroup);
// Add User to Group
router.route("/groupadd").put(protect, addToGroup);
router.route("/:chatId").put(protect, renameGroup);
router.route("/:chatId").delete(protect, deleteChat);
router.route("/:chatId").post(protect, fetchChat);
module.exports = router;