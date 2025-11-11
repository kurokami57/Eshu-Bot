module.exports = function ({ models, Users }) {
  const { readFileSync, writeFileSync } = require("fs-extra");
  const path = __dirname + "/data/usersData.json";

  // 🪙 Load user data file or create if missing
  let $;
  try {
    $ = require(path);
  } catch {
    writeFileSync(path, "{}", { flag: "a+" });
    $ = {};
  }

  // 💾 Save updated data
  async function saveData(data) {
    try {
      if (!data) throw new Error("Data cannot be empty");
      writeFileSync(path, JSON.stringify(data, null, 4));
      return true;
    } catch (error) {
      console.error("Save error:", error);
      return false;
    }
  }

  // 📥 Get user data
  async function getData(userID) {
    try {
      if (!userID) throw new Error("User ID is missing");
      if (!$.hasOwnProperty(userID))
        console.log(`⚠️ User ID: ${userID} not found in database`);
      const data = await Users.getData(userID);
      return data;
    } catch (error) {
      console.error("Get data error:", error);
      return false;
    }
  }

  // ✍️ Update or set user data
  async function setData(userID, options = {}) {
    try {
      if (!userID) throw new Error("User ID is missing");
      if (typeof options !== "object")
        throw new Error("Options must be an object");
      if (!$.hasOwnProperty(userID))
        throw new Error(`User ID ${userID} does not exist`);
      $[userID] = { ...$[userID], ...options };
      await saveData($);
      return $[userID];
    } catch (error) {
      console.error("Set data error:", error);
      return false;
    }
  }

  // 🗑️ Delete user data (reset money)
  async function delData(userID, callback) {
    try {
      if (!userID) throw new Error("User ID is missing");
      if (!$.hasOwnProperty(userID))
        throw new Error(`User ID ${userID} does not exist`);
      $[userID].money = 0;
      await saveData($);
      if (callback && typeof callback === "function") callback(null, $);
      return $;
    } catch (error) {
      console.error("Delete error:", error);
      if (callback && typeof callback === "function") callback(error, null);
      return false;
    }
  }

  // ➕ Increase money
  async function increaseMoney(userID, money) {
    if (typeof money !== "number")
      throw new Error("Amount must be a number");
    try {
      const balance = (await getData(userID)).money || 0;
      await setData(userID, { money: balance + money });
      return true;
    } catch (error) {
      console.error("Increase money error:", error);
      return false;
    }
  }

  // ➖ Decrease money
  async function decreaseMoney(userID, money) {
    if (typeof money !== "number")
      throw new Error("Amount must be a number");
    try {
      const balance = (await getData(userID)).money || 0;
      if (balance < money) return false;
      await setData(userID, { money: balance - money });
      return true;
    } catch (error) {
      console.error("Decrease money error:", error);
      return false;
    }
  }

  // 🧠 Export functions
  return {
    getData,
    setData,
    delData,
    increaseMoney,
    decreaseMoney,
  };
};
