const { Login } = require("../Login.js");

const Auth = async function (req, res, next) {
  // console.log(req.body);
  // req.header("authorization");
  if (!req.session.token) {
    const login = await Login(req, res);
    console.log("LOGIN RESP", login);
    if (login.flag) {
      req.session.token = login.message;
      next();
    } else {
      return res.status(400).json({
        message: login.message,
        flag: false,
      });
    }
  }
};
module.exports = Auth;
