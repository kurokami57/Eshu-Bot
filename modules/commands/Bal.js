module.exports.config = {
  name: "bal",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "Nerob Malo 💸",
  description: "Check your or someone’s balance 💰",
  commandCategory: "economy",
  usages: "[tag/reply/none]",
  cooldowns: 3,
  aliases: ["balance", "money"]
};

module.exports.run = async function ({ api, event, Currencies, Users }) {
  const { threadID, messageID, senderID, mentions, type, messageReply } = event;

  // 🎯 Determine whose balance to show
  let targetID;
  if (mentions && Object.keys(mentions).length > 0) {
    targetID = Object.keys(mentions)[0];
  } else if (type === "message_reply") {
    targetID = messageReply.senderID;
  } else {
    targetID = senderID;
  }

  // 🧠 Fetch user data
  const data = await Currencies.getData(targetID);
  const name = (await Users.getData(targetID)).name || "Unknown User";
  const money = data.money || 0;

  // 💱 Format numbers like K, M, B, T
  function formatMoney(num) {
    if (num >= 1e12) return (num / 1e12).toFixed(2) + "T";
    if (num >= 1e9) return (num / 1e9).toFixed(2) + "B";
    if (num >= 1e6) return (num / 1e6).toFixed(2) + "M";
    if (num >= 1e3) return (num / 1e3).toFixed(2) + "K";
    return num.toString();
  }

  // 💬 Message formatting
  const formatted = formatMoney(money);
  const self = targetID === senderID;

  const msg = self
    ? `💰 𝗬𝗼𝘂𝗿 𝗕𝗮𝗹𝗮𝗻𝗰𝗲 💎\n━━━━━━━━━━━━━\n💵 ${formatted}\n━━━━━━━━━━━━━`
    : `🪙 𝗕𝗮𝗹𝗮𝗻𝗰𝗲 𝗖𝗵𝗲𝗰𝗸 💸\n━━━━━━━━━━━━━\n👤 ${name}\n💵 ${formatted}\n━━━━━━━━━━━━━`;

  return api.sendMessage(msg, threadID, messageID);
};
