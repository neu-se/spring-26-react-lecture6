import { addGrade, addStudent, getTranscript } from './service';
import './style.css';

const showNewStudentDiv = document.querySelector<HTMLDivElement>('#showNewStudent')!;
document.querySelector<HTMLFormElement>('#addStudent')!.onsubmit = async ev => {
  ev.preventDefault();
  const password = document.querySelector<HTMLInputElement>('#password')!.value.trim();
  const studentName = document.querySelector<HTMLInputElement>('#studentName')!.value.trim();
  const result = await addStudent(password, studentName);
  if ('error' in result) {
    showNewStudentDiv.innerText = `Error: ${result.error}`;
  } else {
    showNewStudentDiv.innerText = `Record created for student '${studentName}' with ID ${result.studentID}`;
  }
};

const showAddGradeDiv = document.querySelector<HTMLDivElement>('#showAddGrade')!;
document.querySelector<HTMLFormElement>('#addGrade')!.onsubmit = async ev => {
  ev.preventDefault();
  const password = document.querySelector<HTMLInputElement>('#password')!.value.trim();
  const studentID = document.querySelector<HTMLInputElement>('#studentIdForAddGrade')!.value.trim();
  const courseName = document.querySelector<HTMLInputElement>('#addGradeCourse')!.value.trim();
  const courseGrade = document.querySelector<HTMLInputElement>('#addGradeGrade')!.value.trim();
  const result = await addGrade(password, studentID, courseName, courseGrade);
  if ('error' in result) {
    showAddGradeDiv.innerText = `Error: ${result.error}`;
  } else {
    showAddGradeDiv.innerText = `Added grade of ${courseGrade} in ${courseName} successfully!`;
  }
};

const showGetTranscriptDiv = document.querySelector<HTMLDivElement>('#showTranscript')!;
document.querySelector<HTMLFormElement>('#viewTranscript')!.onsubmit = async ev => {
  ev.preventDefault();
  const password = document.querySelector<HTMLInputElement>('#password')!.value.trim();
  const studentID = document.querySelector<HTMLInputElement>('#idToView')!.value.trim();
  const result = await getTranscript(password, studentID);
  if ('error' in result) {
    showGetTranscriptDiv.innerText = `Error: ${result.error}`;
  } else if (!result.success) {
    showGetTranscriptDiv.innerText = `No student exists with id ${studentID}`;
  } else {
    const { student, grades } = result.transcript;
    showGetTranscriptDiv.innerText = `Transcript for student ${student.studentName} (id ${student.studentID})`;
    const list = document.createElement('ul');
    showGetTranscriptDiv.append(list);
    for (const record of grades) {
      const item = document.createElement('li');
      item.innerText = `${record.grade} in ${record.course}`;
      list.append(item);
    }
  }
};
