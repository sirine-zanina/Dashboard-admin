const express = require("express");
const router = express.Router();
const usersController = require('../controllers/usersController');

router.route('/')
    .get() // read
    .post() // create
    .patch() // update
    .delete() // delete

module.exports = router;