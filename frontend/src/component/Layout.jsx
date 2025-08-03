import React from "react";
import { Outlet, Link } from "react-router-dom";
import Footer from "./Footer.jsx";
import Header from "./Header.jsx";

function Layout() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      {/* Header */}
      <Header />

      {/* Content Area */}
      <main className="flex-1 mt-[64px]"> {/* Adjusted for header height */}
        <Outlet />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default Layout;