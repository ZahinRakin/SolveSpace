function UserCard({ user, userType, removeUser }) {
  return (
    <div className="border p-4 rounded-md mb-4 flex justify-between items-center">
      <div>
        <h3 className="font-semibold">{user.firstname} {user.lastname}</h3>
        <p>{user.email}</p>
      </div>
      <button
        onClick={() => removeUser(userType, user._id)}
        className="text-red-600 hover:text-red-800"
      >
        Remove
      </button>
    </div>
  );
}
export default UserCard;