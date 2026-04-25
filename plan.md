# Score Entry Implementation Plan

## 1. Create Score Entry Component
- Create `src/components/ScoreEntry.tsx`.
- This component will:
  - Take `subject`, `students`, and `onUpdateStudents` as props.
  - Display a table of students in the grade matching the subject.
  - Provide input fields for entering scores.
  - Calculate and update the student's `averageGrade` and `subjectGrades`.
  - Provide a "Back" button to return to the subject list.

## 2. Update Manage Classes Component
- Modify `src/components/ManageClasses.tsx`:
  - Add props: `students: Student[]`, `onUpdateStudents: (students: Student[]) => void`.
  - Add state `selectedSubjectForScores: Subject | null`.
  - If `selectedSubjectForScores` is null, show the existing subject management UI.
  - If `selectedSubjectForScores` is NOT null, render the `ScoreEntry` component.
  - Add an "Enter Scores" button to each subject card.

## 3. Update School Admin Dashboard
- Modify `src/components/SchoolAdminDashboard.tsx`:
  - Pass the `students` and `onUpdateStudents` props to the `ManageClasses` component within the `renderContent` function.
  - Change the label of the "Manage Classes" menu item to "Subjects" to match user terminology.

## 4. Verification
- Verify that clicking "Subjects" shows the subject list.
- Verify that clicking "Enter Scores" on a subject card opens the score entry table.
- Verify that entering scores and saving updates the student data and average grades.
- Call `validate_build` to ensure no TypeScript or build errors.