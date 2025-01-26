import User from "../models/users.models.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import jwt from "jsonwebtoken";

const StudentController = {
  students: [],
  requestForTeacher: (studentId, teacherId) => {
    console.log(`Student ${studentId} requested teacher ${teacherId}.`);
  },

  applyToJoin: (studentId, subjectId) => {
    console.log(`Student ${studentId} applied to join subject ${subjectId}.`);
  },

  searchTeachers: (userId) => {
    console.log(`Searching teachers for user ID ${userId}...`);
    return [];
  },

  viewProfile: (studentId) => {
    const student = StudentController.students.find(s => s.id === studentId);
    if (student) {
      console.log("Student profile:", student);
      return student;
    } else {
      console.log("Student not found.");
      return null;
    }
  },

  updateProfile: (studentId, updatedData) => {
    const studentIndex = StudentController.students.findIndex(s => s.id === studentId);
    if (studentIndex !== -1) {
      StudentController.students[studentIndex] = { ...StudentController.students[studentIndex], ...updatedData };
      console.log("Profile updated:", StudentController.students[studentIndex]);
      return StudentController.students[studentIndex];
    } else {
      console.log("Student not found.");
      return null;
    }
  },

  deleteAccount: (studentId) => {
    const initialLength = StudentController.students.length;
    StudentController.students = StudentController.students.filter(s => s.id !== studentId);
    if (StudentController.students.length < initialLength) {
      console.log(`Student account with ID ${studentId} deleted.`);
      return true;
    } else {
      console.log("Student not found.");
      return false;
    }
  },

  viewAllNotification: (studentId) => {
    console.log(`Fetching all notifications for student ID ${studentId}...`);
    return [];
  },

  addStudent: (student) => {
    StudentController.students.push(student);
    console.log("Student added:", student);
  }
};

export default StudentController
