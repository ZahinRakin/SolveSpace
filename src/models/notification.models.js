import mongoose from 'mongoose';
import mongooseAggregatePaginate from 'mongoose-aggregate-paginate-v2'; //this paginates. if possible I will add it later.

const notificationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', 
    required: true,
  },
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', 
    required: false, 
  },
  message: {
    type: String, 
    required: true,
  },
  isRead: {
    type: Boolean, 
    default: false,
  }
}, {timestamps: true});

const Notification = mongoose.model('Notification', notificationSchema);

export default Notification;