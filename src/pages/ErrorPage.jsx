import React from "react";
import { Link, useRouteError } from "react-router-dom";

export default function ErrorPage() {
  const error = useRouteError();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <h1 className="text-4xl font-bold text-red-600">Oops!</h1>
      <p className="text-lg text-gray-800 mt-2">
        Something went wrong.
      </p>
      <p className="mt-4 text-sm text-gray-600">
        {error?.status || 404}: {error?.statusText || "Page Not Found"}
      </p>
      <Link
        to="/"
        className="mt-6 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
      >
        Go Back to Home
      </Link>
    </div>
  );
};
