# 🏋️ Replog – Personal Gym Tracker Web App
**Replog** is a minimalist, dark-mode web app made for tracking your own gym workouts – no fluff, no subscriptions, just clean and fast logging for sets, reps, and weight. Built mobile-first, with a vibrant orange accent, it lets users create their own exercises, build training plans, and track workouts with ease.

## 🚀 Features (MVP)
### 🧱 Exercises
- Create your own exercises
  - Fields: name, muscle group (from backend list), description, sets, rep range
  - Placeholder for exercise image (future-ready)
- Edit and delete exercises (if not used in past workouts)

### 🏗️ Workout Plans
- Create personalized training plans
- Add any number of exercises
- Define:
  - Default sets
  - Rep range (e.g. 10–12)
- Plans are editable and per-user

### 🏋️ Workout Tracker
- Start a session from any saved plan
- Vertical scroll layout for exercises
- Each exercise displays:
  - Default number of sets
  - Rep range (e.g. 10–12)
  - Pre-filled weight input with **last used value** (if available)
- Log weight and reps per set
- Add or remove sets dynamically

### 👤 Profile Page
- Shows:
  - Past workouts (history)
  - Light stats (total workouts this week, total sets/reps, etc.)
- (Future) Settings area

### 📁 Mocked Data Folder
- Store all demo/mock data in `mockedData/` folder:
  - `exercises.js`
  - `workoutPlans.js`
  - `workouts.js`
  - `userStats.js`
  - `muscleGroups.js` (server-defined list)

## 🎨 UI & Design
- **Dark mode only**
- **Primary color**: `#f97316` (Tailwind orange-500)
- Rounded corners
- Mobile-first
- Clean Flexbox layout (no CSS grid)

## 🧩 Tech Stack
- **Frontend**: Next.js + TailwindCSS
- **Backend**: Next.js API routes (or optional Express)
- **Database**: Neon PostgreSQL
- **Hosting**: Vercel
- **Auth**: Manual login (MVP), later email/password system

## 📅 Roadmap

### ✅ MVP Goals
- [X] Basic Layout and mocked data
- [ ] Exercise management
- [ ] Workout plan builder
- [ ] Workout tracker UI
- [ ] Simple login screen
- [ ] Mobile-first layout
- [ ] Profile page with workout history

### 🔜 Post-MVP Features
- [ ] Registration and email auth
- [ ] Share/import workout plans
- [ ] Export workout data
- [ ] Track personal bests (PRs)
- [ ] Advanced insights (volume, frequency)
- [ ] Upload exercise images

## 🔐 Privacy
All data is saved per-user and stored in the database. No third-party tracking, no public data exposure.

## 🤘 Dev Notes
- Use Flex layout for all UI
- Keep data fetching minimal and optimized for mobile
- Follow Tailwind best practices for styling and color themes
- DB migrations tool (e.g. Prisma or Drizzle) TBD

