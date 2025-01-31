import mongoose from 'mongoose';

const requestSchema = new mongoose.Schema({
  request_id: {
    type: mongoose.Schema.Types.ObjectId,
    auto: true,
    required: true
  },
  student_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true
  },
  subject: {
    type: String,
    required: true
  },
  class_level: {
    type: String,
    enum: ['Beginner', 'Intermediate', 'Advanced'],
    required: true
  },
  mode: {
    type: String,
    enum: ['Online', 'Offline'],
    required: true
  },
  status: {
    type: String,
    enum: ['Pending', 'Accepted', 'Completed'],
    required: true
  },
  interested_teachers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Teacher'
  }],
  selected_teacher_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Teacher'
  },
  payment: {
    type: Number,
    required: true
  },
  created_at: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

const Request = mongoose.model('Request', requestSchema);

export default Request;
