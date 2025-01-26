import User from "../models/users.models.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import jwt from "jsonwebtoken";

const TeacherController = {
  teachers: [],
  postTuition: (teacherId, tuitionDetails) => {
    console.log(`Teacher ${teacherId} posted tuition:`, tuitionDetails);
  },

  searchStudents: (teacherId, subjectId) => {
    console.log(`Teacher ${teacherId} is searching for students in subject ${subjectId}...`);
    return [];
  },

  showInterest: (teacherId, studentId) => {
    console.log(`Teacher ${teacherId} showed interest in student ${studentId}.`);
  },

  viewProfile: (teacherId) => {
    const teacher = TeacherController.teachers.find(t => t.id === teacherId);
    if (teacher) {
      console.log("Teacher profile:", teacher);
      return teacher;
    } else {
      console.log("Teacher not found.");
      return null;
    }
  },

  updateProfile: (teacherId, updatedData) => {
    const teacherIndex = TeacherController.teachers.findIndex(t => t.id === teacherId);
    if (teacherIndex !== -1) {
      TeacherController.teachers[teacherIndex] = { ...TeacherController.teachers[teacherIndex], ...updatedData };
      console.log("Profile updated:", TeacherController.teachers[teacherIndex]);
      return TeacherController.teachers[teacherIndex];
    } else {
      console.log("Teacher not found.");
      return null;
    }
  },

  deleteAccount: (teacherId) => {
    const initialLength = TeacherController.teachers.length;
    TeacherController.teachers = TeacherController.teachers.filter(t => t.id !== teacherId);
    if (TeacherController.teachers.length < initialLength) {
      console.log(`Teacher account with ID ${teacherId} deleted.`);
      return true;
    } else {
      console.log("Teacher not found.");
      return false;
    }
  },

  viewAllNotification: (teacherId) => {
    console.log(`Fetching all notifications for teacher ID ${teacherId}...`);
    return [];
  },

  addTeacher: (teacher) => {
    TeacherController.teachers.push(teacher);
    console.log("Teacher added:", teacher);
  }
};

export default TeacherController;
