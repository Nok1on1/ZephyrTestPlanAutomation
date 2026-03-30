# Zephyr Test Plan Automation (zPlan)

A command-line tool designed to fetch Zephyr Scale Test Plans, extract Sub-tasks from Jira Issues, fetch Test Cases and build a consolidated document (e.g. Test Plan Objective table) for your Test cycle. It automatically generates a newly formatted Test Plan.

## Prerequisites
- **Node.js**: Ensure Node.js is installed (v24 or more).
- **Zephyr Scale API Key**: A token used to access Zephyr Scale.
- **Jira API Token**: An API token generated from your Atlassian account,
- **Jira Email** your Atlassian account email.

## Setup

1. **Clone the repository** (if you haven't already) and install the dependencies:
```bash
npm install
```

2. **Build the project**:
```bash
npm run build
```

3. **install globally**:
```bash
npm install -g .
```

3. **Configure Environment Variables**:
   The tool searches for a file named `.zephyr_env` located in your user's home directory (e.g., `~/.zephyr_env` on Linux/macOS or `C:\Users\<YourUser>\.zephyr_env` on Windows).

   Create that file and populate it with the following environment variables:
   ```env
   # Your Zephyr Scale API Token
   ZEPHYR_TOKEN=Bearer <YOUR_ZEPHYR_TOKEN>

   # Your Jira Email Address
   JIRA_EMAIL=your.email@example.com

   # Your Jira API Token
   JIRA_TOKEN=<YOUR_JIRA_API_TOKEN>

   # Logging level (optional, default is 'info')
   # LOG_LEVEL=debug
   ```

## Usage

You can run the tool in two ways: using local `npm` scripts or by globally.

### Option A: Using NPM 
You can run the uncompiled typescript version directly:
```bash
npm run main <TEST_PLAN_KEY> [-dTime <time>] [-dQuality <quality>]
```

### Option B: Using the Global Command
After Installing Program With
```bash
npm install -g .
```

you can use the `zPlan` command anywhere in your terminal:
```bash
zPlan <TEST_PLAN_KEY> [-dTime <time>] [-dQuality <quality>]
```

### Arguments

- `<TEST_PLAN_KEY>`: **(Required)** The key of the source Zephyr Test Plan (e.g., `PROJ-P1`).
- `-dTime <time>`: *(Optional)* Sets the duration or estimated time for the objective.
- `-dQuality <quality>`: *(Optional)* Sets the quality metric for the objective.

### Example

```bash
zPlan TEST-P105 -dTime "2 days" -dQuality "High"
```

## Features
- Extracts all assigned test cases from a test plan.
- Scans associated Jira issues and fetches their sub-tasks and responsible reviewers/assignees.
- Generates a neat formatted HTML objective structure outlining regressions, deployments, and testing scopes.
- Creates a duplicated or completely new Test Plan with the generated data (there is no PUT api call for plan in zephyr at this moment).
