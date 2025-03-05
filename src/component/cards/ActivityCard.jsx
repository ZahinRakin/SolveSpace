import React from "react";
import { Clock } from "lucide-react";

const ActivityCard = ({ title, icon, items, color, dateField, titleField }) => {
  const colorClasses = {
    blue: "bg-blue-100 text-blue-600",
    green: "bg-green-100 text-green-600",
    purple: "bg-purple-100 text-purple-600",
    amber: "bg-amber-100 text-amber-600"
  };
  
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden h-full transition-all hover:shadow-lg">
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-center">
          <div className={`p-2 rounded-md ${colorClasses[color]}`}>
            {React.cloneElement(icon, { className: "h-5 w-5" })}
          </div>
          <h3 className="ml-2 font-semibold">{title}</h3>
        </div>
      </div>
      <ul className="divide-y divide-gray-100">
        {items.slice(0, 4).map((item, index) => (
          <li key={index} className="p-3 hover:bg-gray-50">
            <p className="font-medium text-gray-800 truncate">{item[titleField]}</p>
            <div className="flex items-center text-xs text-gray-500 mt-1">
              <Clock className="h-3 w-3 mr-1" />
              {new Date(item[dateField]).toLocaleDateString()}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ActivityCard;