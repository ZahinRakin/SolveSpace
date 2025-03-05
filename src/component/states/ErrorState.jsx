import React from "react";
import { AlertCircle } from "lucide-react";

const ErrorState = ({ error }) => (
  <div className="min-h-screen bg-gray-50 p-8 flex justify-center items-start">
    <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded shadow-md max-w-lg">
      <div className="flex">
        <AlertCircle className="h-6 w-6 text-red-500 flex-shrink-0" />
        <div className="ml-3">
          <h3 className="text-lg font-medium text-red-800">Error</h3>
          <p className="text-sm text-red-700 mt-1">{error}</p>
        </div>
      </div>
    </div>
  </div>
);

export default ErrorState;