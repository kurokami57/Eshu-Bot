module.exports.config = {
  name: "give",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "Nerob Malo 💸",
  description: "Give money to another user 💵",
  commandCategory: "economy",
  usages: "[tag/reply] [amount]",
  cooldowns: 5
};

module.exports.run = async function ({ api, event, args, Currencies, Users }) {
  const { threadID, messageID, senderID, mentions, messageReply, type } = event;

  // 🎯 Determine the receiver
  let receiverID;
  if (mentions && Object.keys(mentions).length > 0) {
    receiverID = Object.keys(mentions)[0];
  } else if (type === "message_reply") {
    receiverID = messageReply.senderID;
  } else {
    return api.sendMessage(
      "⚠️ You must tag or reply to someone to give them money!",
      threadID,
      messageID
    );
  }

  // 💰 Get the amount
  const amount = parseFloat(args[args.length - 1]);
  if (isNaN(amount) || amount <= 0)
    return api.sendMessage(
      "⚠️ Please enter a valid amount greater than 0!",
      threadID,
      messageID
    );

  // 🚫 Self-transfer check
  if (receiverID === senderID)
    return api.sendMessage("😅 You can't give money to yourself!", threadID, messageID);

  // 🧠 Fetch balances
  const senderData = await Currencies.getData(senderID);
  const receiverData = await Currencies.getData(receiverID);
  const senderMoney = senderData.money || 0;

  // 🧾 Check sender has enough money
  if (senderMoney < amount)
    return api.sendMessage("❌ You don't have enough balance to give that amount.", threadID, messageID);

  // 💸 Perform transfer
  await Currencies.decreaseMoney(senderID, amount);
  await Currencies.increaseMoney(receiverID, amount);

  // 👤 Get names
  const senderName = (await Users.getData(senderID)).name || "Unknown";
  const receiverName = (await Users.getData(receiverID)).name || "Unknown";

  // 💱 Format amount (K/M/B/T)
  function formatMoney(num) {
    if (num >= 1e12) return (num / 1e12).toFixed(2) + "T";
    if (num >= 1e9) return (num / 1e9).toFixed(2) + "B";
    if (num >= 1e6) return (num / 1e6).toFixed(2) + "M";
    if (num >= 1e3) return (num / 1e3).toFixed(2) + "K";
    return num.toString();
  }

  // ✅ Confirmation message
  const msg = `💸 𝗧𝗿𝗮𝗻𝘀𝗳𝗲𝗿 𝗦𝘂𝗰𝗰𝗲𝘀𝘀𝗳𝘂𝗹 💰
━━━━━━━━━━━━━━━━━
👤 From: ${senderName}
🎁 To: ${receiverName}
💵 Amount: ${formatMoney(amount)} 💵
━━━━━━━━━━━━━━━━━`;

  return api.sendMessage(msg, threadID, messageID);
};
