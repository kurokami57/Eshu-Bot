module.exports.config = {
  name: "inf",
  version: "1.0.2",
  hasPermssion: 0,
  credits: "Nerob Malo", // 🖤 Respect the creator
  description: "Show admin and bot information",
  commandCategory: "info",
  cooldowns: 1,
  dependencies: {
    "request": "",
    "fs-extra": "",
    "axios": ""
  }
};

module.exports.run = async function({ api, event, args, client, Users, Threads, __GLOBAL, Currencies }) {
  const axios = global.nodemodule["axios"];
  const request = global.nodemodule["request"];
  const fs = global.nodemodule["fs-extra"];
  const moment = require("moment-timezone");

  const time = process.uptime();
  const hours = Math.floor(time / (60 * 60));
  const minutes = Math.floor((time % (60 * 60)) / 60);
  const seconds = Math.floor(time % 60);
  const uptime = `${hours}h ${minutes}m ${seconds}s`;

  const timeNow = moment.tz("Asia/Dhaka").format("『DD/MM/YYYY』 【HH:mm:ss】");

  const links = [
    "https://i.imgur.com/kb1JvKn.jpg",
    "https://i.imgur.com/3gRUIaU.jpg",
    "https://i.imgur.com/5gTq6z2.jpg",
    "https://i.imgur.com/HYkXTwg.jpg"
  ];

  const imageURL = links[Math.floor(Math.random() * links.length)];

  const pathImg = __dirname + "/cache/inf.jpg";

  const callback = () => {
    api.sendMessage({
      body: `🌸 𝗕𝗢𝗧 & 𝗢𝗪𝗡𝗘𝗥 𝗜𝗡𝗙𝗢 🌸

⚔️ 𝗕𝗢𝗧 𝗡𝗔𝗠𝗘: ${global.config.BOTNAME}
👑 𝗢𝗪𝗡𝗘𝗥: 𝗡𝗲𝗿𝗼𝗯 🇧🇩

🌐 𝗙𝗔𝗖𝗘𝗕𝗢𝗢𝗞: https://www.facebook.com/profile.php?id=61557548527867

✨ 𝗕𝗢𝗧 𝗣𝗥𝗘𝗙𝗜𝗫: ${global.config.PREFIX}
🕒 𝗧𝗶𝗺𝗲 𝗡𝗼𝘄: ${timeNow}
⚡ 𝗨𝗣𝗧𝗜𝗠𝗘: ${uptime}

💫 𝗧𝗵𝗮𝗻𝗸𝘀 𝗳𝗼𝗿 𝘂𝘀𝗶𝗻𝗴 ${global.config.BOTNAME} 💫
Made with ❤️ by 𝗡𝗲𝗿𝗼𝗯`,
      attachment: fs.createReadStream(pathImg)
    }, event.threadID, () => fs.unlinkSync(pathImg));
  };

  request(encodeURI(imageURL))
    .pipe(fs.createWriteStream(pathImg))
    .on("close", () => callback());
};
