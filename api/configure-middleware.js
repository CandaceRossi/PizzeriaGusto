const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
require("dotenv").config();
console.log(process.env.JWT_SECRET);

module.exports = server => {
  server.use(helmet());
  server.use(express.json());
  server.use(cors());
};
