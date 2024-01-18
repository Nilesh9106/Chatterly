const express = require('express');
const messageController = require('../controllers/messageController');
const { protect } = require("../middlewares/authMiddleware");
const router = express.Router();

router.get('/:chatId', protect, messageController.allMessages);
router.post('/', protect, messageController.sendMessage);

module.exports = router;