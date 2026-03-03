<div align="center">

# Productivity Pulse

**Automated activity tracking for your GitHub profile.**

<br />

![Gist Update](https://img.shields.io/badge/Status-Live_Updates-0078D4?style=for-the-badge&logo=github&logoColor=white)
![Automation](https://img.shields.io/badge/Powered_By-GitHub_Actions-2088FF?style=for-the-badge&logo=github-actions&logoColor=white)
![Timezone](https://img.shields.io/badge/Region-Asia%2FJakarta-8A2BE2?style=for-the-badge&logo=target&logoColor=white)

<br />

### Workflow Overview
This system monitors your last 100 public activities to map your daily productivity distribution.
The data is synchronized directly to a GitHub Gist to enhance your profile dynamically.

---

### Setup Guide

**1. Fork this Repository**
You must fork this repository to your own account to enable the workflow to run within your environment.

**2. Secret Configuration**
Add the following variables in **Settings > Secrets and variables > Actions**:

| Key | Purpose |
| :--- | :--- |
| GH_TOKEN | Personal Access Token (Classic) with Gist and Repo scopes. |
| GIST_ID | The unique identifier from your Gist URL. |
| TIMEZONE | Set to Asia/Jakarta or your local timezone. |
| MY_PLAYLIST_LINK | Your preferred music playlist URL. |

**3. Execution**
Enable the **Actions** tab, then trigger the workflow manually or let it run automatically every hour.

---

### Technical Stack
Node.js • Octokit v19 • GitHub Actions • Date-fns

<br />

*Your activity defines your rhythm. Keep coding.*

</div>
