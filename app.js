const express = require("express");
const cookieParser = require("cookie-parser");
const sessions = require("express-session");
const router = express.Router();
const bodyParser = require("body-parser");
const path = require("path");
const dotenv = require("dotenv");
const Auth = require("./middleware/Auth");
dotenv.config();
const { rechargePlan } = require("./service");
const async = require("hbs/lib/async");

////******Session of create token begin*******/

//Set express sessions
const oneDay = 1000 * 60 * 60 * 24;
router.use(
  sessions({
    secret: "Roundpay",
    saveUninitialized: true,
    cookie: { maxAge: oneDay },
    resave: false,
  })
);

//Sessions work start

router.use(
  sessions({
    secret: "Roundpay",
    saveUninitialized: true,
    cookie: { maxAge: oneDay },
    resave: false,
  })
);

router.use(cookieParser());

router.get("/get", function (Request, Response) {
  Request.session.token = {
    token:
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEwNDAyIiwidG9rZW4iOiIzZDg1ZGQxNGQ2ODQxYjNhMTM1MTg5NTc0NmFhNzhkYSIsIm5iZiI6MTY2MTg0MTg0NiwiZXhwIjoxNjYyNzA1ODQ2LCJpYXQiOjE2NjE4NDE4NDZ9.jAZEprRcHCAu0NvhQzF4qcbSWk05R1iZXUhNYIlJPAg",
  };
  Response.send("Session Set");
});

router.get("/gettoken", Auth, function (Request, Response) {
  Response.send(Request.session.token);
});

////******Session of create token end*******/

////******Session of spkey begin*******/

const Day = 1000 * 60 * 60 * 24;

router.use(
  sessions({
    secret: "Round",
    saveUninitialized: true,
    cookie: { maxAge: Day },
    resave: false,
  })
);

//Sessions work start

router.use(
  sessions({
    secret: "Round",
    saveUninitialized: true,
    cookie: { maxAge: Day },
    resave: false,
  })
);

router.use(cookieParser());

router.get("/getSpkey", Auth, async function (Request, Response) {
  var response = {};
  if (!Request.session.spkey) {
    console.log("hit");
    response = await getSPKey(Request, Response);
  }
  response = Request.session.spkey.data;
  Response.send(response);
});

////******Session of spkey end*******/

////******Session of circle ID begin*******/

const day = 1000 * 60 * 60 * 24;

router.use(
  sessions({
    secret: "Roundpay_Lucknow",
    saveUninitialized: true,
    cookie: { maxAge: day },
    resave: false,
  })
);

router.use(
  sessions({
    secret: "Roundpay_Lucknow",
    saveUninitialized: true,
    cookie: { maxAge: day },
    resave: false,
  })
);

router.use(cookieParser());

router.get("/getCircleCode", Auth, async function (Request, Response) {
  var response = await circleID(Request.session.token);
  console.log("hit", response);
  Response.status(200).json(response);
});

////******Session of circle ID end*******/

router.get("/Prepaid", function (Request, Response) {
  console.log(Request?.session?.token ?? "no value");
  Response.sendFile(`${__dirname}/index.html`);
});

router.get("/DTH", function (Request, Response) {
  Response.sendFile(`${__dirname}/DTH.html`);
});

router.get("/MobileLookup", function (Request, Response) {
  Response.sendFile(`${__dirname}/MobileLookup.html`);
});

router.get("/", function (Request, Response) {
  Response.sendFile(`${__dirname}/DefaultPage.html`);
});

router.get("/Postpaid", function (Request, Response) {
  Response.sendFile(`${__dirname}/Postpaid.html`);
});

router.get("/plansDetail", function (Request, Response) {
  Response.sendFile(`${__dirname}/plansDetail.html`);
});

router.get("/rechargePlan", async function (Request, Response) {
  Response.sendFile(`${__dirname}/rechargePlan.html`);
});

router.post("/rechargePlan", Auth, async function (Request, Response) {
  console.log(Request);
  var response = await rechargePlan(
    Request.query.o,
    Request.query.cc,
    Request.session.token
  );
  // console.log("plans hit", response);
  Response.status(200).json(response);
});

module.exports = router;
