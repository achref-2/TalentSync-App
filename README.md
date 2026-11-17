# TalentSync

A recruitment platform that reads a candidate's CV, compares it with a job description and returns a match score, concrete feedback and a draft cover letter. Candidates, recruiters and admins each get their own workspace.

This was my final-year project at the Faculty of Sciences of Bizerte, built during my internship at AlloGenie (Feb–Jun 2025). It was graded **Excellent**.

**[Live preview](https://achref-2.github.io/TalentSync-App/)** · [Portfolio write-up](https://achref-2.github.io/#work)

![Resume vs. job description analysis](https://achref-2.github.io/shots/analysis.webp)

> This repository is the frontend. The live preview runs without the backend, so sign-in and the CV analysis don't work there. The screenshots show those parts.

## What it does

**Candidates**
- Sign up with email and password or with Google
- Upload a CV, or build one in the app and export it as PDF
- Get a match score against a job, with feedback on skills and experience and a generated cover letter
- Browse and pin jobs, track applications and respond to interview invitations

**Recruiters**
- Post jobs and see applicants ranked by their match score
- Move applications through statuses, schedule interviews and keep interview notes
- New recruiter accounts wait for admin approval

**Admins**
- Approve or reject recruiters and moderate job posts

## How it's built

```
React + Vite (this repo)  ──REST + JWT──▶  Node.js / Express API  ──▶  MongoDB
                                                    │
                                                    └──▶  Python scripts + Gemini API
                                                          (CV extraction, matching, cover letters)
```

- **Frontend:** React 18, Vite, React Router, Tailwind CSS, MUI, react-pdf / jsPDF for CV export
- **Auth:** JWT sessions and Google OAuth (`@react-oauth/google`), with separate routes per role
- **Backend (separate repo):** Node.js, Express, MongoDB, file uploads, role-based access control
- **AI:** Python scripts calling the Gemini API to extract CV data, score the match and draft the cover letter

| Landing page | Candidate dashboard |
| --- | --- |
| ![Landing page](https://achref-2.github.io/shots/landing.webp) | ![Candidate dashboard](https://achref-2.github.io/shots/dashboard.webp) |
| **Sign-in with Google** | **UML class diagram** |
| ![Sign-in](https://achref-2.github.io/shots/signin.webp) | ![UML class diagram](https://achref-2.github.io/shots/uml.webp) |

## Run it locally

You need Node.js 20 or newer.

```bash
npm install
cp .env.example .env    # then fill in the values below
npm start               # http://localhost:3000/TalentSync-App/
```

`VITE_API_URL` points the app at the TalentSync API (default `http://localhost:5000`). The Google OAuth client ID for sign-in is set in `src/pages/candidat/Login/Login.jsx` and `src/pages/candidat/Singup/index.jsx`.

`npm run build` creates the production build in `dist/`. Set `VITE_BASE=/` if you host it at the root of a domain instead of under `/TalentSync-App/`.

## Deployment

Every push to `main` builds the app with GitHub Actions and publishes it to GitHub Pages (`.github/workflows/deploy.yml`). The API URL comes from the repository variable `VITE_API_URL`.

## Project structure

```
src/
├── pages/
│   ├── landingPage/   Landing page, pricing, blog
│   ├── candidat/      Candidate area: dashboard, CV builder, jobs, applications, interviews
│   └── recruiter/     Recruiter area: jobs, applicants, interviews
├── components/        Shared UI, auth wrapper, admin panel
└── config.js          API base URL
```

## Author

Achraf Aroua · [Portfolio](https://achref-2.github.io) · [LinkedIn](https://www.linkedin.com/in/achref-aroua/)

The landing page started from the open-source [React landing page template](https://github.com/issaafalkattan/React-Landing-Page-Template) by Issaaf Kattan.
