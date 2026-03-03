const { Octokit } = require("@octokit/rest");
const { formatInTimeZone } = require("date-fns-tz");

const octokit = new Octokit({ auth: process.env.GH_TOKEN });

async function updateGist() {
  const { data: user } = await octokit.users.getAuthenticated();
  const timezone = process.env.TIMEZONE;

  const gist = await octokit.gists.get({ gist_id: process.env.GIST_ID });
  const oldFiles = Object.keys(gist.data.files);

  const events = await octokit.activity.listEventsForAuthenticatedUser({
    username: user.login,
    per_page: 100
  });

  const stats = { 
    "🌅 Morning": 0, 
    "☀️ Daytime": 0, 
    "🌆 Evening": 0, 
    "🌙 Night": 0 
  };
  
  const pushEvents = events.data.filter(event => event.type === "PushEvent");
  const totalCommits = pushEvents.length;

  const greetings = {
    Morning: [
      "🌅 ☕ Morning dew and fresh git init.",
      "🌄 🍳 Scrambling eggs and resolving conflicts.",
      "🌤️ 🌿 Garden breeze and green contribution tiles.",
      "🌞 🧗 Climbing the mountain of technical tasks.",
      "🏔️ 🧊 Crisp morning air, crystal clear logic.",
      "🌾 🚜 Cultivating features in the early light.",
      "⛵ 🌊 Sailing through the sea of new ideas.",
      "🎈 ⛅ Rising high with the morning sun.",
      "🌸 🍯 Sweet success and spring morning commits.",
      "🏙️ 👟 Early jog, early push, early win.",
      "🏡 🥛 Breakfast at home, code on the cloud.",
      "⛲ 🐦 Birds chirping, functions returning true.",
      "🌲 🏕️ Forest morning vibes and robust code.",
      "🌅 🚲 Pedaling through the first sprint of the day.",
      "⚡ 🌅 High energy under the rising sun."
    ],
    Daytime: [
      "🏙️ 🍱 Bento box and mid-day refactoring.",
      "☀️ 🏖️ Coding with the heat of the summer sun.",
      "🏢 🏗️ Building digital empires in the city.",
      "🏟️ ⚽ Peak performance during peak daylight.",
      "🎡 🎟️ Full speed ahead like a Ferris wheel.",
      "🏜️ 🌵 Dry code and desert sun resilience.",
      "🏎️ 🛣️ Racing through the afternoon backlog.",
      "🚀 🌌 High noon launch to the production server.",
      "🧩 🏢 Fitting the pieces together in the office.",
      "🌴 🥥 Tropical vibes and fluid layout design.",
      "🥪 🏙️ Quick bite, big impact, city lights.",
      "🏛️ 📜 Legacy code under the bright afternoon sky.",
      "🛰️ 🌍 Global deploys under the midday sun.",
      "🚢 ⚓ Anchored in deep focus at 2 PM.",
      "🏗️ 🏗️ Constructing frameworks in broad daylight."
    ],
    Evening: [
      "🌆 🌮 Tacos, tea, and dusk-time debugging.",
      "🌇 🎨 Painting the UI with golden hour hues.",
      "🏡 🕯️ Coming home to a clean repository.",
      "🚲 🌇 Sunset rides and smooth code reviews.",
      "🌉 🌃 Crossing the bridge to completion.",
      "🎭 🍷 Evening elegance in every line of code.",
      "🍂 🌅 Autumn sunset and stable deployments.",
      "🌋 🧡 Warm evening glows and hot fixes.",
      "🗼 🗼 City lights blinking, code syncing.",
      "🎡 🎡 Rolling out updates as the sun dips low.",
      "🌠 🎑 Moon-viewing and final code polishing.",
      "🌻 🌇 Watching the sunset, closing the tickets.",
      "🛸 🌆 Evening sky full of stars and strings.",
      "🛤️ 🌇 Journeying home with a green streak.",
      "🏠 🍵 Warm tea and cool evening refactoring."
    ],
    Night: [
      "🌌 🍜 Midnight ramen and starlit refactoring.",
      "🌙 🦉 Owl eyes and deep-focus development.",
      "🌠 🐙 Reaching for the stars in the night sky.",
      "🛸 🌑 Dark mode activated, galaxy explored.",
      "🌉 🌌 Neon lights and nocturnal logic.",
      "🏛️ 🕯️ Silent night, brilliant architecture.",
      "🛤️ 🌌 The night train to a bug-free build.",
      "💤 🌙 Dreaming in binary, coding in silence.",
      "🛸 🔭 Scanning the horizon for edge cases.",
      "🕯️ 📜 Ancient wisdom in modern night code.",
      "🪐 🛰️ Orbiting the problem until it's solved.",
      "🌊 🌑 Deep sea debugging in the quiet hours.",
      "⚡ 🌃 Electric night vibes and fast builds.",
      "🧪 🌌 Alchemy in the dark, gold in the repo.",
      "🧿 🌙 Protected by the moon, driven by code."
    ]
  };

  pushEvents.forEach(event => {
    const date = new Date(event.created_at);
    const hour = parseInt(formatInTimeZone(date, timezone, "H"));
    if (hour >= 6 && hour < 12) stats["🌅 Morning"]++;
    else if (hour >= 12 && hour < 18) stats["☀️ Daytime"]++;
    else if (hour >= 18 && hour < 24) stats["🌆 Evening"]++;
    else stats["🌙 Night"]++;
  });

  let maxType = "Morning";
  if (totalCommits > 0) {
    const rawMax = Object.keys(stats).reduce((a, b) => stats[a] >= stats[b] ? a : b);
    maxType = rawMax.split(" ")[1];
  }

  const currentGreeting = greetings[maxType][Math.floor(Math.random() * greetings[maxType].length)];

  const statsLines = Object.entries(stats).map(([label, count]) => {
    const percentage = totalCommits > 0 ? ((count / totalCommits) * 100).toFixed(1) : "0.0";
    const barWidth = 20;
    const completed = Math.round((percentage / 100) * barWidth);
    const bar = "█".repeat(completed).padEnd(barWidth, "░");

    return `${label.padEnd(10)} ${count.toString().padStart(3)} commits  ${bar}  ${percentage.padStart(5)}%`;
  });

  const filesUpdate = {};
  oldFiles.forEach(file => { filesUpdate[file] = null; });
  filesUpdate[currentGreeting] = { content: statsLines.join("\n") };

  await octokit.gists.update({
    gist_id: process.env.GIST_ID,
    files: filesUpdate
  });
}

updateGist().catch(console.error);
