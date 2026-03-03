const { Octokit } = require("@octokit/rest");
const { formatInTimeZone } = require("date-fns-tz");

const octokit = new Octokit({ auth: process.env.GH_TOKEN });

async function updateGist() {
  const { data: user } = await octokit.users.getAuthenticated();
  const username = user.login;
  const timezone = process.env.TIMEZONE || "Asia/Jakarta";

  const events = await octokit.activity.listPublicEventsForUser({
    username,
    per_page: 100
  });

  const stats = { Morning: 0, Daytime: 0, Evening: 0, Night: 0 };

  events.data
    .filter(event => event.type === "PushEvent")
    .forEach(event => {
      const hour = parseInt(formatInTimeZone(new Date(event.created_at), timezone, "H"));
      if (hour >= 6 && hour < 12) stats.Morning++;
      else if (hour >= 12 && hour < 18) stats.Daytime++;
      else if (hour >= 18 && hour < 24) stats.Evening++;
      else stats.Night++;
    });

  const total = Object.values(stats).reduce((a, b) => a + b, 0);
  const lines = Object.entries(stats).map(([label, count]) => {
    const percentage = total > 0 ? ((count / total) * 100).toFixed(1) : 0;
    const bar = "█".repeat(Math.floor(percentage / 4)).padEnd(25, "░");
    return `${label.padEnd(10)} ${count.toString().padStart(3)} commits ${bar} ${percentage}%`;
  });

  await octokit.gists.update({
    gist_id: process.env.GIST_ID,
    files: {
      "Activity Stats": {
        content: lines.join("\n")
      }
    }
  });
}

updateGist().catch(console.error);
