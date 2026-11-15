# Lesotho Digital Skills Academy (LSDA)

Free digital-skills learning platform with automatic PDF certificates.
Stack: React (Vite) + Node/Express + MySQL. Languages: English and Sesotho.

## 1. What you need
- Node.js 18 or newer
- MySQL 8 (or MariaDB 10.5+) running on your computer
- VS Code

## 2. First-time setup (VS Code terminal)

```bash
# Backend
cd server
npm install
copy .env.example .env      # Windows   (Mac/Linux: cp .env.example .env)
# open .env and set DB_PASSWORD (your MySQL root password) and JWT_SECRET
npm run db:init             # creates the database and tables
npm run seed                # loads 6 courses + the admin account
npm run dev                 # API on http://localhost:5000
```

Open a SECOND terminal:

```bash
# Frontend
cd client
npm install
npm run dev                 # website on http://localhost:5173
```

Open http://localhost:5173

Admin login (change it in server/.env before you seed): `admin@lsda.local` / `ChangeMe123`

## 3. Try the full flow
1. Register (tick the consent box).
2. Open a course, take the **starter quiz** (this is your M&E baseline).
3. Finish every lesson, then take the **final assessment** (pass mark 70%).
4. Download your PDF certificate, then check it on **Verify certificate**.
5. Log in as admin and open **Manage** to see the M&E indicators.

## 4. Folder structure
```
lsda/
  database/schema.sql          all tables
  server/src/
    index.js                   Express app
    init.js, seed.js           database setup + starter content
    routes/                    auth, learning, certificates, admin
    lib/certs.js, lib/pdf.js   certificate numbers + PDF/QR generation
    middleware/auth.js         JWT login + roles
  client/src/
    pages/                     Home, Courses, CourseDetail, Lesson, Quiz,
                               Auth, Dashboard, Certificates, Verify, Admin
    i18n.js                    English + Sesotho interface text
    styles.css                 design (Basotho-blanket colour band)
```

## 5. How it maps to the assignment
| Requirement | Where |
|---|---|
| Pilot with 8–15 real users | Register your partner's learners; Manage page counts them |
| Baseline + post data | Starter quiz (`kind='pre'`) vs final assessment (`kind='post'`) |
| KPIs (>=5, incl. inclusion, usability, outcome) | Manage page: registered, completion, skills gain, female %, usability %, certificates |
| Consent / guardian consent under 18 | Registration form + server checks |
| Data minimisation | Verify page shows only "Thabo M."; no ID numbers collected |
| Two iteration cycles | Use the feedback form + keep a change log (see section 7) |

## 6. Things you MUST still do (not code)
- **Sesotho content**: UI text, course titles and descriptions have a Sesotho draft. Lesson text and quiz questions are English only (the site shows a notice and falls back to English). Get a fluent Sesotho speaker to review the draft and add lesson/quiz translations through the Manage page.
- **Real partner**: the brief requires a real community partner, a needs assessment and a pilot. Software alone will not meet the marking criteria.
- **Quiz design**: the starter quiz and final assessment use the same questions, so a gain can partly be memory. Add a second set of questions (or practical tasks, like "send a WhatsApp message") and say so honestly in your limitations section.
- **Certificates** are academy-issued completion certificates, not accredited qualifications (this is printed on them).
- **Low-bandwidth**: the site loads two Google Fonts. For very low data, delete the `<link>` fonts in client/index.html; the site falls back to system fonts.

## 7. Suggested change log (evidence for "two iteration cycles")
Keep a table: Date | Feedback from learner (photo/notes, with consent) | Change made | Result.

## 8. Deploying for the pilot
- Cheapest: run on one laptop at the partner site and open it from phones on the same Wi-Fi (set `PUBLIC_URL` in server/.env to the laptop's address).
- Online: any host that supports Node + MySQL. Run `npm run build` in `client/`, then serve `client/dist` with a web server and proxy `/api` to the Node app. Set a long random `JWT_SECRET`.
