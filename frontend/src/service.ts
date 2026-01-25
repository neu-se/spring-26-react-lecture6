import { z } from 'zod';

const zAddStudentResponse = z.union([
  z.object({ error: z.string() }),
  z.object({ studentID: z.int() }),
]);

/**
 * Validate inputs and call the `addStudent` api
 *
 * @param password - credentials
 * @param studentName - a student name (error if empty)
 * @returns a validation error or API response
 */
export async function addStudent(
  password: string,
  studentName: string,
): Promise<z.infer<typeof zAddStudentResponse>> {
  if (studentName === '') {
    return { error: 'Student name must be non-empty' };
  }

  try {
    const response = await fetch('/api/addStudent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        password,
        studentName,
      }),
    });
    const data = zAddStudentResponse.parse(await response.json());
    return data;
  } catch (e) {
    return { error: `(unexpected) ${e}` };
  }
}

const zAddGradeResponse = z.union([
  z.object({ error: z.string() }),
  z.object({ success: z.literal(true) }),
]);

/**
 * Validate inputs and call the `addGrade` api
 *
 * @param password - credentials
 * @param studentIDStr - student ID (error if not a positive integer)
 * @param courseName - student name
 * @param courseGradeStr - course grade (error if not a number between 0 and 100, inclusive)
 * @returns a validation error or API response
 */
export async function addGrade(
  password: string,
  studentIDStr: string,
  courseName: string,
  courseGradeStr: string,
): Promise<z.infer<typeof zAddGradeResponse>> {
  const studentID = parseInt(studentIDStr);
  if (isNaN(studentID) || `${studentID}` !== studentIDStr || studentID < 0) {
    return { error: 'Student ID is invalid' };
  }

  const courseGrade = parseFloat(courseGradeStr);
  if (
    isNaN(courseGrade) ||
    `${courseGrade}` !== courseGradeStr ||
    courseGrade < 0 ||
    courseGrade > 100
  ) {
    return { error: 'Course grade is not valid' };
  }

  if (courseName === '') {
    return { error: 'Course name is required' };
  }

  try {
    const response = await fetch('/api/addGrade', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        password,
        studentID,
        courseName,
        courseGrade,
      }),
    });
    const data = zAddGradeResponse.parse(await response.json());
    return data;
  } catch (e) {
    return { error: `(unexpected) ${e}` };
  }
}

const zGetTranscriptResponse = z.union([
  z.object({ error: z.string() }),
  z.object({ success: z.literal(false) }),
  z.object({
    success: z.literal(true),
    transcript: z.object({
      student: z.object({ studentID: z.int(), studentName: z.string() }),
      grades: z.array(z.object({ course: z.string(), grade: z.number() })),
    }),
  }),
]);

export async function getTranscript(
  password: string,
  studentIDStr: string,
): Promise<z.infer<typeof zGetTranscriptResponse>> {
  const studentID = parseInt(studentIDStr);
  if (isNaN(studentID) || `${studentID}` !== studentIDStr || studentID < 0) {
    return { error: 'Student ID is invalid' };
  }

  try {
    const response = await fetch('/api/getTranscript', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        password,
        studentID,
      }),
    });
    const data = zGetTranscriptResponse.parse(await response.json());
    return data;
  } catch (e) {
    return { error: `(unexpected) ${e}` };
  }
}
