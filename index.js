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

  const stats = { 
    "🌅 Morning": 0, 
    "☀️ Daytime": 0, 
    "🌆 Evening": 0, 
    "🌙 Night": 0 
  };
  
  const pushEvents = events.data.filter(event => event.type === "PushEvent");
  const totalCommits = pushEvents.length;
  const maxCapacity = 100;

  const greetings = {
    Morning: ["🍳 Cooking up some new features.", "🥐 Croissant and clean code.", "☕ Fresh coffee and fresh commits."],
    Daytime: ["🍱 Bento box and bug fixing.", "🍕 Powering through with pizza.", "💻 Deep in the flow of daylight."],
    Evening: ["🌮 Tacos and technical debt.", "🌇 Refining thoughts under the evening sky.", "🎨 Painting the code with evening hues."],
    Night: ["🍜 Late night ramen and refactoring.", "🌙 Architecting dreams in the night.", "🐙 The night is quiet, the code is loud."]
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
    const percentage = ((count / maxCapacity) * 100).toFixed(1);
    const bar = "█".repeat(Math.floor(percentage / 4)).padEnd(25, "░");
    return `${label.padEnd(12)} ${count.toString().padStart(3)} commits    ${bar} ${percentage}%`;
  });

  if (myPlaylistLink) {
    statsLines.push(`\nMy Playlist\n▶ Play: ${myPlaylistLink}`);
  }

  const filesUpdate = {};
  oldFiles.forEach(file => { filesUpdate[file] = null; });
  filesUpdate[currentGreeting] = { content: statsLines.join("\n") };

  await octokit.gists.update({
    gist_id: process.env.GIST_ID,
    files: filesUpdate
  });
}

updateGist().catch(console.error);
