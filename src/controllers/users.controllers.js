const UserController = {
  users: [],

  viewProfile: (userId) => {
    const user = UserController.users.find(u => u.id === userId);
    if (user) {
      console.log("User profile:", user);
      return user;
    } else {
      console.log("User not found.");
      return null;
    }
  },

  updateProfile: (userId, updatedData) => {
    const userIndex = UserController.users.findIndex(u => u.id === userId);
    if (userIndex !== -1) {
      UserController.users[userIndex] = { ...UserController.users[userIndex], ...updatedData };
      console.log("Profile updated:", UserController.users[userIndex]);
      return UserController.users[userIndex];
    } else {
      console.log("User not found.");
      return null;
    }
  },

  deleteAccount: (userId) => {
    const initialLength = UserController.users.length;
    UserController.users = UserController.users.filter(u => u.id !== userId);
    if (UserController.users.length < initialLength) {
      console.log(`User account with ID ${userId} deleted.`);
      return true;
    } else {
      console.log("User not found.");
      return false;
    }
  },

  viewAllNotification: (userId) => {
    console.log(`Fetching all notifications for user ID ${userId}...`);
    return [];
  },

  addUser: (user) => {
    UserController.users.push(user);
    console.log("User added:", user);
  }
};

export default UserController;