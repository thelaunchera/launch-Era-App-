# Self Love Gym

A free, mobile-first workout web app for beginners. Built as a standalone GitHub Pages site for The Launch Era's Self Love Gym community.

## What is included

- Three home workouts: gentle full-body strength, mobility, and low-impact cardio.
- Guided exercise cues, a pause/resume timer, and an adaptable weekly schedule.
- Recent sessions, streaks, favorites, English and Latin American Spanish.
- Installable PWA with cached app files for offline access after first visit.
- No signup, ads, paywall, analytics, or server-side storage. Progress stays in browser `localStorage` on the current device.

## Publishing

The site is plain HTML, CSS, and JavaScript, with relative URLs. Publish the `main` branch from `/ (root)` under **Settings → Pages**. The entry point is `index.html` and `.nojekyll` prevents Jekyll processing. It works at any GitHub Pages repository path.

For local review, run `python3 -m http.server 8000` from this directory and visit `http://localhost:8000/`. Service workers need HTTPS or localhost; on GitHub Pages they run over HTTPS.

## Content and privacy

Sessions are general beginner fitness suggestions. The plan includes two strength days, a mobility day and a low-impact cardio day, plus optional easy walks and rest. It does not claim to meet weekly activity guidelines on its own. Exercise guidance is general; adapt movement to your ability and stop if painful. No exercise videos, accounts, bank connections, or email messaging are included in this version.

The user’s name and workout history remain in their browser. Clearing site data removes progress. Switching devices does not sync progress.
