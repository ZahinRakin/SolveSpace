import React from "react";
import GrowthItem from "../items/GrowthItem";
import { TrendingUp, Users, UserCheck } from "lucide-react";

const GrowthCard = ({ data }) => (
  <div className="bg-white rounded-lg shadow-md overflow-hidden transition-all hover:shadow-lg">
    <div className="bg-gradient-to-r from-indigo-500 to-purple-500 p-4 text-white">
      <div className="flex items-center">
        <TrendingUp className="h-6 w-6" />
        <h3 className="ml-2 font-semibold text-lg">Growth & Performance</h3>
      </div>
    </div>
    <div className="p-4 space-y-4">
      {data ? (
        <>
          <GrowthItem 
            title="Student Growth" 
            value={data.studentGrowth} 
            icon={<Users className="h-5 w-5" />} 
          />
          <GrowthItem 
            title="Teacher Growth" 
            value={data.teacherGrowth} 
            icon={<UserCheck className="h-5 w-5" />} 
          />
        </>
      ) : (
        <p className="text-gray-500 text-center py-4">No growth data available</p>
      )}
    </div>
  </div>
);

export default GrowthCard;