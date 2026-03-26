//app.js
let gigs = require(./"gigsDB")
const express = require("express");
const cors = require("cors");

const app = express();
app.use(express.json());

app.use(cors());

let gigs = [


]


module.exports = app;