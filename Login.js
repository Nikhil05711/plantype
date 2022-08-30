const axios = require("axios").default;

const Login = async (Request, Response) => {
  try {
    const res = await axios.post("https://roundpay.net/userauth/getToken", {
      userId: "10402",
      UserToken: "3d85dd14d6841b3a1351895746aa78da",
    });
    console.log("RESPONSE ", res.data.token);
    if (!res) {
      return {
        message: "Failed to get details",
        flag: false,
      };
    }
    return { message: res.data.token, flag: true };
  } catch (error) {
    return { message: error.message.toString(), flag: false };
  }
};

module.exports = { Login };
