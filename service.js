const axios = require("axios").default;
const dotenv = require("dotenv");
dotenv.config();

const getSPKey = async (Request, Response) => {
  try {
    const mySpkey = await axios.get(
      "https://roundpay.net/PlanServices/v1/GetOperatorCodes",
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${Request.session.token}`,
        },
      }
    );
    if (!mySpkey) {
      Response.status(400).json({
        message: "Failed to get Details",
        flag: false,
      });
    }
    Request.session.spkey = mySpkey.data;
  } catch (error) {
    return Response.status(400).json({
      message: error.message.toString(),
      flag: false,
    });
  }
};

const circleID = async (token) => {
  try {
    const res = await axios.get(
      "https://roundpay.net/PlanServices/v1/GetCircleCodes",
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return res.data;
  } catch (error) {}
};

const rechargePlan = async (spKey, cId, token) => {
  try {
    const plans = await axios.get(
      `https://roundpay.net/PlanServices/v1/RechargePlan?spkey=${spKey}&circleId=${cId}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    console.log(plans.data.data.data);
    return plans?.data;
  } catch (error) {
    // console.log(error.response);
  }
};

module.exports = { getSPKey, circleID, rechargePlan };
