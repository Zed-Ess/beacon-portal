# 🏮 Beacon Educational Consult — Partner Portal

A full web application for Beacon partners to communicate, track material production, vote on decisions, and manage documents. Built for GitHub Pages + Firebase.

---

## What is included

| Module | Features |
|---|---|
| **Dashboard** | Live stats, department overview, recent notices |
| **Noticeboard** | Post and receive notices; filter by department; urgent/pinned types |
| **Meetings** | Schedule and view meetings; upcoming vs past |
| **Polls & voting** | Create polls; cast votes; results update in real time |
| **Pipeline** | Track all materials through the 9-stage Beacon production workflow |
| **Members** | Partner directory; approve new members; assign HoD roles |
| **Documents** | Link to governance docs, templates, and completed materials |

---

## Setup — Step by step

### Step 1: Create a Firebase project

1. Go to [https://console.firebase.google.com](https://console.firebase.google.com)
2. Click **Add project** — name it `beacon-educational-consult`
3. Disable Google Analytics (not needed) and click **Create project**

### Step 2: Enable Authentication

1. In the Firebase Console, go to **Build → Authentication**
2. Click **Get started**
3. Under **Sign-in method**, enable **Email/Password**
4. Click **Save**

### Step 3: Create a Firestore database

1. Go to **Build → Firestore Database**
2. Click **Create database**
3. Choose **Start in production mode** (you will set rules in Step 5)
4. Select a region close to Ghana — `europe-west1` (Belgium) is usually fastest
5. Click **Enable**

### Step 4: Get your Firebase config

1. Go to **Project settings** (gear icon) → **Your apps**
2. Click **Add app** → choose the Web icon (`</>`)
3. Register the app with nickname `beacon-portal`
4. Copy the `firebaseConfig` object shown

### Step 5: Paste your config

Open `js/config.js` and replace the placeholder values:

```js
const firebaseConfig = {
  apiKey:            "paste-your-apiKey-here",
  authDomain:        "paste-your-authDomain-here",
  projectId:         "paste-your-projectId-here",
  storageBucket:     "paste-your-storageBucket-here",
  messagingSenderId: "paste-your-messagingSenderId-here",
  appId:             "paste-your-appId-here"
};
```


import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-storage.js";

const firebaseConfig = {
  apiKey:            "AIzaSyCdab2VP0D5uLg8Q8jPBSXMPtDs1ljtzec",
  authDomain:        "beacon-educational-consult.firebaseapp.com",
  projectId:         "beacon-educational-consult",
  storageBucket:     "beacon-educational-consult.firebasestorage.app",
  messagingSenderId: "969008066460",
  appId:             "1:969008066460:web:415dd5a324afe34b8fa259"
};

const app    = initializeApp(firebaseConfig);
export const auth    = getAuth(app);
export const db      = getFirestore(app);
export const storage = getStorage(app);



### Step 6: Set Firestore security rules

In the Firebase Console, go to **Firestore → Rules**, paste the contents of
**`firestore.rules`** (in the root of this project), and click **Publish**.

These rules require an account to be **approved (status = active)** before it
can read or write any portal data — a pending or rejected account can only see
its own profile. Only the Founder can approve members or change roles, and
members cannot promote or approve themselves.


### Step 7: Deploy to GitHub Pages

1. Create a new **private** repository on GitHub named `beacon-portal`
2. Upload all files from this folder to the repository
3. Go to **Settings → Pages**
4. Under **Source**, select `Deploy from a branch`
5. Choose `main` branch and `/ (root)` folder
6. Click **Save**

Your app will be live at:
`https://YOUR-GITHUB-USERNAME.github.io/beacon-portal/`

### Step 8: Register the first account (Founder)

1. Open your live URL
2. Click **Register**
3. Fill in your details — select **All departments** or whichever applies
4. After registering, go to **Firebase Console → Firestore → users → your document**
5. Change the `role` field from `member` to `founder` and `status` from `pending` to `active`
6. From that point, you can approve other partners from within the app itself

---

## Adding your Firebase domain to Authorised Domains

1. Go to **Firebase Console → Authentication → Settings → Authorised domains**
2. Add your GitHub Pages domain: `YOUR-USERNAME.github.io`

---

## File structure

```
beacon-app/
├── index.html          Login and registration page
├── app.html            Main protected application
├── css/
│   └── style.css       All styles
├── js/
│   └── config.js       Firebase configuration (edit this file)
└── README.md           This setup guide
```

---

## Upgrading to Firebase Hosting (optional)

GitHub Pages works well. If you later want a custom domain or faster loading, you can switch to Firebase Hosting:

```bash
npm install -g firebase-tools
firebase login
firebase init hosting
firebase deploy
```

---

## Data model (Firestore collections)

| Collection | What it stores |
|---|---|
| `users` | Partner profiles, roles, departments, subjects, status |
| `notices` | Noticeboard posts with type, audience, author |
| `meetings` | Scheduled meetings with date, venue, type, audience |
| `polls` | Polls with options, vote counts, voter list |
| `pipeline` | Materials in production with stage, type, author, due date |
| `documents` | Document metadata with links, category, status |

---

## Support

This app was built by Beacon Educational Consult. For technical issues, contact the Founder/Coordinator.



git remote add origin https://github.com/Zed-Ess/beacon-portal.git
git branch -M main
git push -u origin main

git init
git add .
git commit -m "Initial commit — Beacon Partner Portal"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/beacon-portal.git
git push -u origin main

