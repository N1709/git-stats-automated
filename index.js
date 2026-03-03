const { Octokit } = require("@octokit/rest");
const { formatInTimeZone } = require("date-fns-tz");

const octokit = new Octokit({ auth: process.env.GH_TOKEN });
const myPlaylistLink = process.env.MY_PLAYLIST_LINK;

async function updateGist() {
  const { data: user } = await octokit.users.getAuthenticated();
  const timezone = process.env.TIMEZONE || "Asia/Jakarta";

  const gist = await octokit.gists.get({ gist_id: process.env.GIST_ID });
  const oldFiles = Object.keys(gist.data.files);

  const events = await octokit.activity.listPublicEventsForUser({
    username: user.login,
    per_page: 100
  });

  const stats = { Morning: 0, Daytime: 0, Evening: 0, Night: 0 };
  const pushEvents = events.data.filter(event => event.type === "PushEvent");
  const totalPotential = 100;

  const greetings = {
    Morning: [
      "\u{1F373} Cooking up some new features.",
      "\u{1F950} Croissant and clean code.",
      "\u{1F369} Donuts and deployments.",
      "\u{1F951} Avocado toast and API calls.",
      "\u{1F34E} An apple a day keeps the bugs away.",
      "\u{2615} Fresh coffee and fresh commits.",
      "\u{1F35E} Breakfast and building code.",
      "\u{1F375} Morning tea, time to create."
    ],
    Daytime: [
      "\u{1F371} Bento box and bug fixing.",
      "\u{1F959} Healthy salad, healthy logic.",
      "\u{1F355} Powering through with pizza.",
      "\u{1F96A} Quick sandwich, fast commits.",
      "\u{1F4BB} Deep in the flow of daylight."
    ],
    Evening: [
      "\u{1F32E} Tacos and technical debt.",
      "\u{1F306} Refining thoughts under the evening sky.",
      "\u{1F3A8} Painting the code with evening hues.",
      "\u{1F354} Burgers and backend logic."
    ],
    Night: [
      "\u{1F35C} Late night ramen and refactoring.",
      "\u{1F319} Architecting dreams in the silence of the night.",
      "\u{1F419} The night is quiet, the code is loud.",
      "\u{1F366} Sweet treats for night owl sessions."
    ],
    Inactive: [
      "\u{1F634} Status: Inactive. Currently in hibernation mode, please do not disturb.",
      "\u{1F4A4} System Standby. Resting and recharging, please avoid interruptions.",
      "\u{1F614} Offline Mode. Undergoing system recovery and scheduled hibernation.",
      "\u{1F4BB} Activity suspended. Currently in deep sleep, do not disturb.",
      "\u{1F6AB} Status: Do Not Disturb. Currently offline for system maintenance.",
      "\u{1F50B} Battery recharging. System is in hibernation, do not wake."
    ]
  };

  pushEvents.forEach(event => {
    const hour = parseInt(formatInTimeZone(new Date(event.created_at), timezone, "H"));
    if (hour >= 6 && hour < 12) stats.Morning++;
    else if (hour >= 12 && hour < 18) stats.Daytime++;
    else if (hour >= 18 && hour < 24) stats.Evening++;
    else stats.Night++;
  });

  const maxType = pushEvents.length > 0 
    ? Object.keys(stats).reduce((a, b) => stats[a] >= stats[b] ? a : b) 
    : "Inactive";

  const currentGreeting = greetings[maxType][Math.floor(Math.random() * greetings[maxType].length)];

  const statsLines = Object.entries(stats).map(([label, count]) => {
    const percentage = ((count / totalPotential) * 100).toFixed(1);
    const bar = "\u{2588}".repeat(Math.floor(percentage / 4)).padEnd(25, "\u{2591}");
    return `${label.padEnd(12)} ${count.toString().padStart(3)} commits    ${bar} ${percentage}%`;
  });

  const inactiveCount = totalPotential - pushEvents.length;
  const inactivePct = ((inactiveCount / totalPotential) * 100).toFixed(1);
  const inactiveBar = "\u{2588}".repeat(Math.floor(inactivePct / 4)).padEnd(25, "\u{2591}");
  statsLines.push(`${"Inactive".padEnd(12)} ${inactiveCount.toString().padStart(3)} non-active ${inactiveBar} ${inactivePct}%`);

  const contentArray = [...statsLines];
  
  if (myPlaylistLink && myPlaylistLink.trim() !== "") {
    contentArray.push("\nMy Playlist");
    contentArray.push(`\u{25B6} Play: ${myPlaylistLink}`);
  }

  const contentBody = contentArray.join("\n");
  const filesUpdate = {};

  oldFiles.forEach(file => { filesUpdate[file] = null; });
  filesUpdate[currentGreeting] = { content: contentBody };

  await octokit.gists.update({
    gist_id: process.env.GIST_ID,
    files: filesUpdate
  });
}

updateGist().catch(console.error);
