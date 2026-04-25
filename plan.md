# Plan: School Management System Refinement

## 1. Data Model Updates (`src/lib/types.ts`)
- Update `School` interface to include `code`.
- Create `DetailedScore` interface to hold the new fields:
  - `test1`, `groupWork`, `test2`, `projectWork`, `examScore`
  - Computed fields (for UI/storage): `totalClassScore`, `classScore50`, `examScore50`, `overallTotal`, `position`, `grade`, `remark`.
- Update `Student` interface to store these detailed scores per subject.

## 2. Mock Data Updates (`src/lib/mock-data.ts`)
- Add `code` to existing schools.
- Add some sample `detailedScores` to students.

## 3. App Entry Flow (`src/App.tsx`)
- Implement a search screen as the initial view.
- Add "Enter School Code" input and "Search" button.
- If code matches, show the school card.
- Clicking the school card enters the `SchoolAdminDashboard`.

## 4. Super Admin Enhancements (`src/components/SuperAdminDashboard.tsx`)
- Add school code generation logic when a school is created.
- Display school codes in the list.

## 5. School Admin Dashboard Refinement (`src/components/SchoolAdminDashboard.tsx`)
- Update tabs: 'Manage Students', 'Manage Classes', 'Manage Teachers', 'Manage Subjects', 'Bulk PDF', 'Clear Data', 'Settings'.
- Add basic implementations for 'Clear Data' (reset scores) and 'Bulk PDF' (placeholder).

## 6. Detailed Subject Score Table (`src/components/ScoreEntry.tsx`)
- Transform the score entry into a comprehensive table with 15 columns:
  - Serial Number, Picture, Name, Test 1 (30), Group Work (20), Test 2 (30), Project Work (20), Total Class Score (100), 50% of Class Score (A), Exam Score (100), 50% of Exam Score (B), Overall Total (A+B), Position, Grade, Remark.
- Implement real-time calculations for all dependent fields.
- Implement sorting/ranking for "Position".
- Implement grading logic.

## 7. Navigation Refinement (`src/components/ManageClasses.tsx`)
- Ensure clicking a subject in a class opens the updated `ScoreEntry` view.
