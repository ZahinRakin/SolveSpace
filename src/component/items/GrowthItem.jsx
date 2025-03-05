import React from "react";
import { ArrowUp, ArrowDown } from "lucide-react";

const GrowthItem = ({ title, value, icon }) => {
  const isPositive = value > 0;
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center">
        <div className="p-2 bg-gray-100 rounded-md mr-3">
          {icon}
        </div>
        <span className="font-medium text-gray-700">{title}</span>
      </div>
      <div className={`flex items-center ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
        {value !== undefined ? (
          <>
            <span className="font-bold text-lg">{value.toFixed(2)}%</span>
            {isPositive ? 
              <ArrowUp className="h-4 w-4 ml-1" /> : 
              <ArrowDown className="h-4 w-4 ml-1" />
            }
          </>
        ) : (
          <span className="text-gray-400">No data</span>
        )}
      </div>
    </div>
  );
};

export default GrowthItem;