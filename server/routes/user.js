const express = require('express');
const userController = require('../controllers/userController');
const { protect } = require("../middlewares/authMiddleware");
const router = express.Router();

router.get('/', protect, userController.allUsers);
router.post('/', userController.registerUser);
router.post('/login', userController.authUser);

module.exports = router;