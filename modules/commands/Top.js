module.exports.config = {
  name: "top",
  version: "1.1.0",
  hasPermssion: 0,
  credits: "𝐏𝐫𝐢𝐲𝐚𝐧𝐬𝐡 𝐑𝐚𝐣𝐩𝐮𝐭 & Nerob Malo",
  description: "Show top users, threads, levels, or richest players 💰",
  commandCategory: "economy",
  usages: "[thread/user/money/topbal]",
  cooldowns: 5
};

module.exports.run = async ({ event, api, args, Currencies, Users }) => {
  const { threadID, messageID } = event;
  const fs = require("fs-extra");

  // Validate optional limit number
  if (args[1] && (isNaN(args[1]) || parseInt(args[1]) <= 0))
    return api.sendMessage("⚠️ The list length must be a valid number greater than 0.", threadID, messageID);

  const limit = parseInt(args[1] || 10);
  const option = (args[0] || "").toLowerCase();

  // Helper function: exp → level
  const expToLevel = point => (point < 0 ? 0 : Math.floor((Math.sqrt(1 + (4 * point) / 3) + 1) / 2));

  // ====== TOP LEVEL USERS ======
  if (option === "user" || option === "level") {
    const all = await Currencies.getAll(["userID", "exp"]);
    all.sort((a, b) => b.exp - a.exp);

    let msg = "🏆 𝗧𝗼𝗽 𝗣𝗹𝗮𝘆𝗲𝗿𝘀 𝗕𝘆 𝗟𝗲𝘃𝗲𝗹 🧠\n\n";
    for (let i = 0; i < Math.min(limit, all.length); i++) {
      const user = all[i];
      const name = (await Users.getData(user.userID)).name || "Unknown";
      const level = expToLevel(user.exp);
      msg += `${i + 1}. ${name} — Lv.${level} (${user.exp} exp)\n`;
    }
    return api.sendMessage(msg, threadID, messageID);
  }

  // ====== TOP THREADS BY MESSAGE COUNT ======
  if (option === "thread" || option === "group") {
    const threadList = [];
    let data;
    try {
      data = await api.getThreadList(limit + 10, null, ["INBOX"]);
    } catch (e) {
      console.log(e);
      return api.sendMessage("❌ Failed to load thread list.", threadID, messageID);
    }

    for (const thread of data) {
      if (thread.isGroup)
        threadList.push({ threadName: thread.name, threadID: thread.threadID, messageCount: thread.messageCount });
    }

    threadList.sort((a, b) => b.messageCount - a.messageCount);

    let msg = "💬 𝗧𝗼𝗽 𝗔𝗰𝘁𝗶𝘃𝗲 𝗚𝗿𝗼𝘂𝗽𝘀 📊\n\n";
    for (let i = 0; i < Math.min(limit, threadList.length); i++) {
      const g = threadList[i];
      msg += `${i + 1}. ${g.threadName || "No Name"}\n🆔 ${g.threadID}\n💭 ${g.messageCount} messages\n\n`;
    }

    return api.sendMessage(msg, threadID, messageID);
  }

  // ====== TOP MONEY / TOPBAL ======
  if (option === "money" || option === "bal" || option === "topbal") {
    const all = await Currencies.getAll(["userID", "money"]);
    all.sort((a, b) => b.money - a.money);

    let msg = "💎 𝗧𝗼𝗽 𝗥𝗶𝗰𝗵𝗲𝘀𝘁 𝗨𝘀𝗲𝗿𝘀 💵\n\n";
    for (let i = 0; i < Math.min(limit, all.length); i++) {
      const user = all[i];
      const name = (await Users.getData(user.userID)).name || "Unknown";
      msg += `${i + 1}. ${name} — ${user.money.toLocaleString()}💵\n`;
    }

    return api.sendMessage(msg, threadID, messageID);
  }

  // ====== If invalid option ======
  const usageMsg = `
⚙️ Usage:
• top user — Top users by level
• top thread — Top active groups
• top money / topbal — Richest users 💰
• top level — Same as top user
Example: top money 15
  `;
  return api.sendMessage(usageMsg.trim(), threadID, messageID);
};
