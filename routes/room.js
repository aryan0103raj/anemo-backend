const express = require("express");
const router = express.Router();
const db = require("../models");
const User = db.user;
const Room = db.room;
const Message = db.message;

router.get("/:userId");
