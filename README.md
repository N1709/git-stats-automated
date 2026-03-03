<div align="center">

# Productivity Pulse 🚀

**An automated system to track and display your GitHub activity distribution.**

<br />

![Gist Update](https://img.shields.io/badge/Status-Live_Updates-0078D4?style=for-the-badge&logo=github&logoColor=white)
![Automation](https://img.shields.io/badge/Powered_By-GitHub_Actions-2088FF?style=for-the-badge&logo=github-actions&logoColor=white)

<br />

### 📊 Personal Coding Rhythm
This tool analyzes your last 100 public events to generate a precise visual representation of your productivity across four time segments: Morning, Daytime, Evening, and Night.

---

### 🛠️ Configuration Guide

#### 1. Setup Environment Secrets
Go to your repository **Settings > Secrets and variables > Actions** and add these three secrets:

| Name | Value Description |
| :--- | :--- |
| **GH_TOKEN** | Your Personal Access Token (classic) with `gist` and `repo` scopes. |
| **GIST_ID** | The ID from your Gist URL (e.g., `https://gist.github.com/user/`**`id_di_sini`**). |
| **TIMEZONE** | Your local timezone (default: `Asia/Jakarta`). |

#### 2. Workflow Trigger
The system is pre-configured to run every hour. You can also trigger it manually:
- Go to the **Actions** tab.
- Select the **Update Gist** workflow.
- Click **Run workflow**.

---

### 💻 Technical Implementation
- **Scale**: Dynamic percentage calculation based on actual commit volume.
- **Visuals**: Precise 20-character bar chart with fixed-width alignment.
- **Backend**: Node.js using `@octokit/rest` for seamless GitHub API integration.

<br />

*Crafted for developers who value precision in their profile.*

</div>
