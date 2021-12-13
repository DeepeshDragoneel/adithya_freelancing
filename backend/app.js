require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const morgan = require("morgan");
const fileUpload = require("express-fileupload");
const router = require("./routes");

const app = express();

app.use(cors());
app.use(morgan("dev"));
app.enable("trust proxy");
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.urlencoded({ extended: true }));
app.use(fileUpload({ useTempFiles: true, tempFileDir: "/tmp/" }));
const mongoose = require("mongoose");

app.use(router);

const port = process.env.PORT || 8000;
mongoose
    .connect(
        // `mongodb+srv://DeepeshDragoneel:${process.env.DB_PASS}@deepeshdragoneel.prwnu.mongodb.net/EMarting?retryWrites=true&w=majority`,
        `mongodb+srv://adithya:${process.env.DB_PASS}@todo.lpvpv.mongodb.net/todo`,
        {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        }
    )
    .then((result) => {
        app.listen(process.env.PORT || 8000, (e) => {
            if (e) {
                console.log(e);
            } else {
                console.log(`CONNECTION TO EXPRESS ESTABLISHED at port`);
            }
        });
    })
    .catch((error) => {
        console.log(error);
    });
