const express = require("express");
const dotenv = require("dotenv").config();
const bodyParser = require("body-parser");

const app = express();
const port = process.env.PORT || 5000;

app.use(bodyParser.json());
app.use("/", require("./routes/personRoutes"));

const server = app.listen(port, () => {
    console.log(`Server running on port ${port} `)
})

module.exports = server;

