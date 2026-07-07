# Deployment Guide
## Vite + React → GitHub → GitHub Pages + Firebase

This guide covers the full journey from a fresh local project to a live site,
every time. Follow the sections in order.

---

## Prerequisites

Install these once. Skip anything already installed.

```powershell
# Node.js (v20 or later) — https://nodejs.org
node -v

# Yarn
npm install -g yarn
yarn -v

# Git — https://git-scm.com
git -v

# Firebase CLI
yarn global add firebase-tools
firebase --version
```

---

## Part 1 — Local project setup

### 1.1 Scaffold the app

```powershell
yarn create vite my-app --template react
cd my-app
yarn install
```

### 1.2 Add Firebase SDK

```powershell
yarn add firebase
```

### 1.3 Create `src/firebase.js`

```js
import { initializeApp } from "firebase/app";
import { getAuth }       from "firebase/auth";
import { getFirestore }  from "firebase/firestore";

const firebaseConfig = {
  apiKey:            "YOUR_API_KEY",
  authDomain:        "YOUR_AUTH_DOMAIN",
  projectId:         "YOUR_PROJECT_ID",
  storageBucket:     "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_SENDER_ID",
  appId:             "YOUR_APP_ID",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db   = getFirestore(app);
```

You will fill in the real values in Part 2.

### 1.4 Configure `vite.config.js`

Add the `base` option so assets resolve correctly under the GitHub Pages subpath.
Replace `my-app` with your exact GitHub repo name.

```js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/my-app/',   // must match your GitHub repo name exactly
})
```

### 1.5 Add the GitHub Actions workflow

Create the file `.github/workflows/deploy.yml` with this exact content:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: true

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}

    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: yarn

      - name: Install dependencies
        run: yarn install --frozen-lockfile

      - name: Build
        run: yarn build

      - name: Upload Pages artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: dist

      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

### 1.6 Check `.gitignore`

Make sure these lines are present (Vite adds them by default):

```
node_modules
dist
dist-ssr
*.local
```

### 1.7 Verify the build locally

```powershell
yarn build
```

It should complete without errors and produce a `dist/` folder.

---

## Part 2 — Firebase project setup

### 2.1 Create the project

1. Go to https://console.firebase.google.com
2. Click **Add project** → give it a name → disable Google Analytics → **Create project**

### 2.2 Enable Authentication

1. Build → **Authentication** → **Get started**
2. Sign-in method → enable **Email/Password** → Save

### 2.3 Create Firestore database

1. Build → **Firestore Database** → **Create database**
2. Choose **Start in production mode**
3. Pick a region (e.g. `europe-west1` for Ghana)
4. Click **Enable**

### 2.4 Get your Firebase config

1. Project settings (gear icon) → **Your apps** → click **Add app** → Web (`</>`)
2. Register with any nickname → copy the `firebaseConfig` object
3. Paste the values into `src/firebase.js` from step 1.3

### 2.5 Set Firestore security rules

Firestore → **Rules** → paste and publish:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

Tighten these rules before going public.

---

## Part 3 — GitHub repository setup

### 3.1 Create a new repo

1. Go to https://github.com/new
2. Name it exactly what you used in `vite.config.js` `base` (e.g. `my-app`)
3. Set visibility to **Private**
4. Leave everything else unchecked — **do not** add README, .gitignore, or license
5. Click **Create repository**

### 3.2 Create a Personal Access Token with the right scopes

You need this once per machine (or when your token expires).

1. GitHub → **Settings** → **Developer settings** → **Personal access tokens** → **Tokens (classic)**
2. Click **Generate new token (classic)**
3. Give it a name, set expiration
4. Check these scopes: **`repo`** (all) + **`workflow`**
5. Click **Generate token** — copy it immediately, you won't see it again
6. Store it in a password manager — **never paste it into chat**

### 3.3 Push your code

Run these from inside your project folder:

```powershell
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/my-app.git
git push -u origin main
```

When prompted for a password, paste your Personal Access Token.

> If git cached an old token and doesn't prompt, run:
> `git remote set-url origin https://YOUR-USERNAME@github.com/YOUR-USERNAME/my-app.git`
> then push again — it will prompt for the token.

**Never embed the token in the remote URL like:**
`https://username:TOKEN@github.com/...` — that exposes it in `git remote -v` output.

### 3.4 Enable GitHub Pages

1. Go to your repo → **Settings** → **Pages**
2. Under **Build and deployment → Source**, select **GitHub Actions**
3. Click **Save**

### 3.5 Watch the deployment

1. Go to your repo → **Actions** tab
2. You should see "Deploy to GitHub Pages" running
3. Wait for the green tick (takes 1–2 minutes)
4. Your site is live at: `https://YOUR-USERNAME.github.io/my-app/`

---

## Part 4 — Connect Firebase Auth to your live domain

Firebase blocks sign-ins from unknown domains by default.

1. Firebase Console → **Authentication** → **Settings** → **Authorized domains**
2. Click **Add domain**
3. Enter: `YOUR-USERNAME.github.io`
4. Click **Add**

---

## Part 5 — Ongoing workflow (after initial setup)

Every time you make changes:

```powershell
git add .
git commit -m "describe your change"
git push origin main
```

That's it. GitHub Actions rebuilds and redeploys automatically.

---

## Troubleshooting

| Symptom | Likely cause | Fix |
|---|---|---|
| 404 on the live URL | Pages source not set to GitHub Actions | Settings → Pages → Source → GitHub Actions |
| Workflow never runs | Push was rejected (missing `workflow` scope) | Check token scopes, push again |
| Assets load as 404 | `base` in vite.config.js doesn't match repo name | Fix the `base` value, push again |
| Firebase login silently fails | Domain not authorized in Firebase | Add domain to Authorized domains (Part 4) |
| `upload-artifact` deprecated error | Old action version in workflow | Use `upload-pages-artifact@v3` + `deploy-pages@v4` |
| `fatal: not a git repository` | Running git from wrong folder | `cd` into the project folder first |
| Token rejected on push | Token missing `workflow` scope | Regenerate token with `repo` + `workflow` scopes |

---

## Quick reference — action versions that work (as of 2026)

```yaml
actions/checkout@v4
actions/setup-node@v4
actions/upload-pages-artifact@v3
actions/deploy-pages@v4
```

Do not use `actions/upload-artifact` or `actions/download-artifact` for Pages
deployments — use `upload-pages-artifact` directly.
