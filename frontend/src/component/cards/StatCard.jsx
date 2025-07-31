import React from 'react';

const StatCard = ({ icon, title, value, bgColor }) => (
  <div className="bg-white rounded-lg shadow-md overflow-hidden transition-all hover:shadow-lg">
    <div className={`${bgColor} p-4 text-white flex justify-between items-center`}>
      <h3 className="font-semibold text-lg">{title}</h3>
      <div className="p-2 bg-white bg-opacity-30 rounded-full">
        {React.cloneElement(icon, { className: "h-5 w-5" })}
      </div>
    </div>
    <div className="p-4">
      <p className="text-3xl font-bold text-gray-800">{value.toLocaleString()}</p>
    </div>
  </div>
);

export default StatCard;