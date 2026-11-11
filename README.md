# LearnSpace – Learning Management System

A responsive React + Vite LMS with student learning flows, profile editing, lesson progress, quizzes and admin course management. Demo data is persisted in the browser's `localStorage`; no backend or real authentication is configured.

## Run locally

```bash
npm install
npm run dev
```

Open the local URL printed by Vite (normally `http://localhost:5173`). For a production check:

```bash
npm run build
npm run preview
```

Requires Node.js 20.19+ or 22.12+ for Vite 7.

## Features

- Student dashboard with enrolled courses, learning statistics and progress.
- Course catalogue with search, category/level filters and sorting.
- Course details, instructor information, curriculum and enrolment.
- My Courses with search, progress filters and sorting.
- Lesson viewer with embedded video lessons, lesson navigation and completion tracking.
- Quiz answer selection, score calculation, answer review and saved attempts.
- Editable student profile, persisted to localStorage. Click the user/avatar in the top bar or choose My profile in the sidebar.
- Admin course CRUD, including lesson and quiz editing. Use the role selector to switch to Admin.
- Responsive desktop, tablet and mobile navigation.
- Toast feedback, notification popover, empty states and confirmation before destructive actions.

## Demo data

The default student is Venkat. Sample instructors use Indian names. Use the top-right role selector to switch between Student and Admin demo views. Role switching is a demo feature, not secure authentication.

## Admin course editor formats

Lessons: one per line, `Title | Duration | Content`.

Quiz: one per line, `Question | Option A | Option B | Option C | Option D | correct option number`.

## Storage

The application stores courses, enrolments, completed lesson IDs, quiz results, profile details and demo role in localStorage. Clearing site data resets the browser-side demo state.

## Notes

- Video lessons are embedded from YouTube; playback requires an internet connection and the videos remaining available from their publishers.
- Course cover images are loaded from Unsplash and require an internet connection.
- This is a frontend demo. It does not process payments or provide server-side accounts, authentication or database storage.
