import React from 'react';

function BatchForm({ formData, setFormData, handleSubmit }) {
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  const classOptions = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "12", "hons", "masters"];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCheckboxChange = (day) => {
    setFormData((prev) => {
      if (prev.weekly_schedule.includes(day)) {
        return {
          ...prev,
          weekly_schedule: prev.weekly_schedule.filter(d => d !== day)
        };
      } else {
        return {
          ...prev,
          weekly_schedule: [...prev.weekly_schedule, day]
        };
      }
    });
  };

  const handleBooleanChange = (e) => {
    const { name, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: checked
    }));
  };

  const handleNumberChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value === "" ? "" : Number(value)
    }));
  };

  const handleInterestAdd = () => {
    const inputId = `student_ids`;
    const inputElement = document.getElementById(inputId);
    const username = inputElement?.value?.trim();
    
    if (username) {
      setFormData((prev) => ({
        ...prev,
        [`student_ids`]: [...prev[`student_ids`], username]
      }));
      if (inputElement) {
        inputElement.value = '';
      }
    }
  };
  
  const handleInterestRemove = (username) => {
    setFormData((prev) => ({
      ...prev,
      [`student_ids`]: prev[`student_ids`].filter(name => name !== username)
    }));
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        {/* Owner ID */}
        <div className="mb-4">
          <label htmlFor="owner_id" className="block text-sm font-medium text-gray-700">Owner ID</label>
          <input
            type="text"
            id="owner_id"
            name="owner_id"
            value={formData.owner_id}
            onChange={handleChange}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        {/* Owner Type */}
        <div className="mb-4">
          <label htmlFor="owner" className="block text-sm font-medium text-gray-700">Owner Type</label>
          <select
            id="owner"
            name="owner"
            value={formData.owner}
            onChange={handleChange}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="">Select owner type</option>
            <option value="teacher">Teacher</option>
            <option value="student">Student</option>
          </select>
        </div>

        {/* Teacher ID */}
        <div className="mb-4">
          <label htmlFor="owner_id" className="block text-sm font-medium text-gray-700">Teacher ID</label>
          <input
            type="text"
            id="teacher_id"
            name="teacher_id"
            value={formData.teacher_id}
            onChange={handleChange}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        {/* Subject */}
        <div className="mb-4">
          <label htmlFor="subject" className="block text-sm font-medium text-gray-700">Subject</label>
          <input
            type="text"
            id="subject"
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        {/* Class */}
        <div className="mb-4">
          <label htmlFor="class" className="block text-sm font-medium text-gray-700">Class</label>
          <select
            id="class"
            name="class"
            value={formData.class}
            onChange={handleChange}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="">Select class</option>
            {classOptions.map((option) => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        </div>

        {/* Weekly Schedule */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Weekly Schedule</label>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
            {days.map((day) => (
              <div
                key={day}
                className={`flex items-center justify-center p-3 rounded-md cursor-pointer border transition-colors ${
                  formData.weekly_schedule.includes(day)
                    ? "bg-indigo-100 border-indigo-500 text-indigo-700"
                    : "border-gray-300 hover:bg-gray-50"
                }`}
                onClick={() => handleCheckboxChange(day)}
              >
                <span className="text-sm font-medium">{day.substring(0, 3)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Time */}
        <div className="mb-4">
          <label htmlFor="time" className="block text-sm font-medium text-gray-700">Time</label>
          <input
            type="time"
            id="time"
            name="time"
            value={formData.time}
            onChange={handleChange}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        {/* Salary */}
        <div className="mb-4">
          <label htmlFor="salary" className="block text-sm font-medium text-gray-700">Salary</label>
          <input
            type="number"
            id="salary"
            name="salary"
            value={formData.salary}
            onChange={handleNumberChange}
            required
            min="0"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        {/* Continuous */}
        <div className="mb-4 flex items-center">
          <input
            type="checkbox"
            id="is_continuous"
            name="is_continuous"
            checked={formData.is_continuous}
            onChange={handleBooleanChange}
            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
          />
          <label htmlFor="is_continuous" className="ml-2 block text-sm text-gray-700">
            Continuous
          </label>
        </div>

        {/* Batch */}
        <div className="mb-4 flex items-center">
          <input
            type="checkbox"
            id="is_batch"
            name="is_batch"
            checked={formData.is_batch}
            onChange={handleBooleanChange}
            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
          />
          <label htmlFor="is_batch" className="ml-2 block text-sm text-gray-700">
            Batch
          </label>
        </div>
        {/**students */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Students</label>
          <div className="flex flex-wrap gap-2 mb-2">
            {formData.student_ids.map((student) => (
              <div key={student} className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full flex items-center">
                <span>{student}</span>
                <button
                  type="button"
                  onClick={() => handleInterestRemove(student)}
                  className="ml-2 text-indigo-700 hover:text-indigo-900"
                >
                  &times;
                </button>
              </div>
            ))}
          </div>
          <div className="flex">
            <input
              type="text"
              id="student_ids"
              placeholder="Enter student username"
              className="flex-grow px-3 py-2 border border-gray-300 rounded-l-md focus:ring-indigo-500 focus:border-indigo-500"
            />
            <button
              type="button"
              onClick={() => handleInterestAdd()}
              className="bg-indigo-600 text-white px-4 py-2 rounded-r-md hover:bg-indigo-700"
            >
              Add
            </button>
          </div>
        </div>
        {/**submit button */}
        <div className="flex justify-center mt-6">
          <button
            type="submit"
            className="bg-indigo-600 text-white py-2 px-6 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Create Batch
          </button>
        </div>
      </form>
    </div>
  );
}

export default BatchForm;
