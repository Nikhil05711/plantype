const express = require("express");
const cookieParser = require("cookie-parser");
const sessions = require("express-session");
const app = express();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const axios = require("axios").default;
const path = require("path");
const dotenv = require("dotenv");
const Auth = require("./middleware/Auth");
dotenv.config();
const { getSPKey, circleID } = require("./service");
const router = require("./app");

app.use(express.static(__dirname + "/public"));
app.use(bodyParser.json({ limit: "50mb" }));
app.use(
  bodyParser.urlencoded({
    limit: "50mb",
    extended: true,
    parameterLimit: 50000,
  })
);

app.set("views", path.join(__dirname + "/public"));
app.set("view engine", "hbs");

//Set express sessions
const oneDay = 1000 * 60 * 60 * 24;
app.use(
  sessions({
    secret: "Roundpay",
    saveUninitialized: true,
    cookie: { maxAge: oneDay },
    resave: false,
  })
);

//Sessions work start

app.use(
  sessions({
    secret: "Roundpay",
    saveUninitialized: true,
    cookie: { maxAge: oneDay },
    resave: false,
  })
);

app.use(cookieParser());

app.get("/get", function (Request, Response) {
  Request.session.token = {
    token:
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEwNDAyIiwidG9rZW4iOiIzZDg1ZGQxNGQ2ODQxYjNhMTM1MTg5NTc0NmFhNzhkYSIsIm5iZiI6MTY2MTg0MTg0NiwiZXhwIjoxNjYyNzA1ODQ2LCJpYXQiOjE2NjE4NDE4NDZ9.jAZEprRcHCAu0NvhQzF4qcbSWk05R1iZXUhNYIlJPAg",
  };
  Response.send("Session Set");
});

app.get("/gettoken", Auth, function (Request, Response) {
  Response.send(Request.session.token);
});

///////////////*******Session create of spkey*************/////////////////

const Day = 1000 * 60 * 60 * 24;

app.use(
  sessions({
    secret: "Round",
    saveUninitialized: true,
    cookie: { maxAge: Day },
    resave: false,
  })
);

//Sessions work start

app.use(
  sessions({
    secret: "Round",
    saveUninitialized: true,
    cookie: { maxAge: Day },
    resave: false,
  })
);

app.use(cookieParser());

app.get("/getSpkey", Auth, async function (Request, Response) {
  var response = {};
  if (!Request.session.spkey) {
    console.log("hit");
    response = await getSPKey(Request, Response);
  }
  response = Request.session.spkey.data;
  Response.send(response);
});

///****Session end of spkey****//////

///*****Session begin of circle id*****///////

const day = 1000 * 60 * 60 * 24;

app.use(
  sessions({
    secret: "Roundpay_Lucknow",
    saveUninitialized: true,
    cookie: { maxAge: day },
    resave: false,
  })
);

app.use(
  sessions({
    secret: "Roundpay_Lucknow",
    saveUninitialized: true,
    cookie: { maxAge: day },
    resave: false,
  })
);

app.use(cookieParser());

app.get("/getCircleCode", Auth, async function (Request, Response) {
  var response = await circleID(Request.session.token);
  console.log("hit", response);
  Response.status(200).json(response);
});

////////////**********Session end of circle id**************////////////////

app.use(router);

app.post("/GetToken", async function (Request, Response) {
  try {
    const res = await axios.post("https://roundpay.net/userauth/getToken", {
      userId: Request.body.userId,
      UserToken: Request.body.UserToken,
    });
    console.log(res.data.token);
    if (!res) {
      Response.status(400).json({
        message: "Failed to get details",
        flag: false,
      });
    }
    return Response.status(200).json({ message: "", flag: true });
  } catch (error) {
    return res
      .status(400)
      .json({ message: error.message.toString(), flag: false });
  }
});

//app.post("/GetSpkey", Auth, abc);

mongoose
  .connect("mongodb://localhost:27017/planInfo", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Successfully Connected with MongoDB"))
  .catch((error) => console.log("Something went wrong"));

//Assign a port manually
const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`Listening on port ${port}...`));
