import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  FaBook, 
  FaCalendarAlt, 
  FaMoneyBillWave, 
  FaUsers, 
  FaClock 
} from "react-icons/fa";
import StudentDashboardHeader from "./StudentDashboardHeader";
import LoadingSpinner from "../../component/LoadingSpinner";
import ErrorMessage from "../../component/ErrorMessage";

function TuitionRequestPage() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null)
  const [formData, setFormData] = useState({
    subject: "",
    class: "",
    title: "",
    subtitle: "",
    description: "",
    days: [],
    time: "",
    price: "",
    maxBatchSize: "",
    is_continuous: false,
    is_batch: false
  });


  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : type === "number" ? Number(value) : value,
    });
  };

  const handleCheckboxChange = (day) => {
    setFormData((prevData) => {
      const days = prevData.days.includes(day)
        ? prevData.days.filter((d) => d !== day)
        : [...prevData.days, day];
      return { ...prevData, days };
    });
  };

  const handlePost = async (e) => {
    e.preventDefault();
    
    try {
      setIsLoading(true);
      const accessToken = localStorage.getItem("accessToken");
      await axios.post(
        "/api/v1/post/create",
        formData,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );
      
    } catch (error) {
      console.error("Error posting data:", error);
      
      setError
    } finally {
      setIsLoading(false);
    }
  };

  const formSections = [
    {
      title: "Basic Information",
      icon: <FaBook className="text-indigo-600" />,
      fields: [
        { label: "Subject", name: "subject", type: "text", placeholder: "e.g. Mathematics, Science, English" },
        { label: "Class/Grade", name: "class", type: "text", placeholder: "e.g. 10th Grade, College Level" },
        { label: "Title", name: "title", type: "text", placeholder: "A brief, catchy title for your tuition post" },
        { label: "Subtitle", name: "subtitle", type: "text", placeholder: "Additional short description" },
      ]
    },
    {
      title: "Tuition Details",
      icon: <FaCalendarAlt className="text-indigo-600" />,
      fields: [
        { label: "Description", name: "description", type: "textarea", placeholder: "Provide detailed information about your teaching approach, materials covered, etc." },
      ]
    },
    {
      title: "Schedule & Payment",
      icon: <FaMoneyBillWave className="text-indigo-600" />,
      fields: [
        { label: "Class Time", name: "time", type: "time", placeholder: "" },
        { label: "Salary", name: "salary", type: "number", placeholder: "Amount in your local currency" },
      ]
    }
  ];

  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

  if (isLoading) {
    return (
      <div>
        <StudentDashboardHeader/>
        <LoadingSpinner/>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <StudentDashboardHeader/>
        <ErrorMessage message={error}/>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <StudentDashboardHeader />
      
      {/* Notification */}
      <div id="notification" className="fixed top-4 right-4 bg-green-500 text-white py-2 px-4 rounded-md shadow-lg transform transition-transform duration-500 ease-in-out translate-y-[-100px]"></div>
      
      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex items-center mb-6">
          <h1 className="text-3xl font-bold ml-4 text-gray-800">Create Tuition Request</h1>
        </div>

        <form
          className="bg-white shadow-md rounded-lg overflow-hidden"
          onSubmit={handlePost}
        >
          <div className="p-6 border-b border-gray-200">
            <p className="text-gray-600">
              Create a detailed tuition request to find the right tutor. The more information you provide, the better matches you'll receive.
            </p>
          </div>

          {formSections.map((section, index) => (
            <div key={index} className="p-6 border-b border-gray-200">
              <div className="flex items-center mb-4">
                {section.icon}
                <h2 className="text-xl font-semibold ml-2 text-gray-800">{section.title}</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {section.fields.map(field => (
                  <div key={field.name} className={field.type === "textarea" ? "col-span-1 md:col-span-2" : ""}>
                    <label htmlFor={field.name} className="block text-sm font-medium text-gray-700 mb-1">
                      {field.label}
                    </label>
                    
                    {field.type === "textarea" ? (
                      <textarea
                        id={field.name}
                        name={field.name}
                        rows="4"
                        value={formData[field.name]}
                        onChange={handleChange}
                        placeholder={field.placeholder}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        required
                      />
                    ) : (
                      <input
                        type={field.type}
                        id={field.name}
                        name={field.name}
                        value={formData[field.name]}
                        onChange={handleChange}
                        placeholder={field.placeholder}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        required
                      />
                    )}
                  </div>
                ))}
              </div>
              
              {/* Additional fields for Schedule section */}
              {section.title === "Schedule & Payment" && (
                <div className="mt-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Available Days</label>
                  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
                    {days.map((day) => (
                      <div 
                        key={day} 
                        className={`flex items-center justify-center p-3 rounded-md cursor-pointer border transition-colors ${
                          formData.days.includes(day) 
                            ? "bg-indigo-100 border-indigo-500 text-indigo-700" 
                            : "border-gray-300 hover:bg-gray-50"
                        }`}
                        onClick={() => handleCheckboxChange(day)}
                      >
                        <FaClock className={`mr-2 ${formData.days.includes(day) ? "text-indigo-500" : "text-gray-400"}`} />
                        <span className="text-sm font-medium">{day.substring(0, 3)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
          
          {/* Class Type Options */}
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <FaUsers className="text-indigo-600 mr-2" />
              Preferences
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="border border-gray-300 rounded-lg p-4 hover:border-indigo-500 transition-colors">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="is_continuous"
                    name="is_continuous"
                    checked={formData.is_continuous}
                    onChange={handleChange}
                    className="w-5 h-5 text-indigo-600 focus:ring-indigo-500 rounded"
                  />
                  <label htmlFor="is_continuous" className="ml-2 block text-sm font-medium text-gray-700">
                    Need Continuous Tuition
                  </label>
                </div>
                <p className="mt-2 text-sm text-gray-500 pl-7">
                  Ongoing tuition that continues until your learning goals are met.
                </p>
              </div>
              
              <div className="border border-gray-300 rounded-lg p-4 hover:border-indigo-500 transition-colors">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="is_batch"
                    name="is_batch"
                    checked={formData.is_batch}
                    onChange={handleChange}
                    className="w-5 h-5 text-indigo-600 focus:ring-indigo-500 rounded"
                  />
                  <label htmlFor="is_batch" className="ml-2 block text-sm font-medium text-gray-700">
                    Group/Batch Tuition
                  </label>
                </div>
                <p className="mt-2 text-sm text-gray-500 pl-7">
                  Prefer tuition in a group setting with other students.
                </p>
              </div>
            </div>
          </div>
          
          {/* Submit Button */}
          <div className="p-6 flex justify-center">
            <button
              type="submit"
              disabled={isLoading}
              className={`px-8 py-3 rounded-md text-white font-medium text-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
                isLoading ? "bg-indigo-400 cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-700"
              }`}
            >
              {isLoading ? "Submitting Request..." : "Submit Tuition Request"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default TuitionRequestPage;