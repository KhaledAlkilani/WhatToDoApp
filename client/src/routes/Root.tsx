import { Outlet } from "react-router-dom";
import Navigation from "../components/Navigation/Navigation";
import { useState } from "react";

const Root = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="h-screen">
      {/* Header for Mobile/Tablet */}
      <div className="md:hidden flex items-center justify-between p-4 bg-pastelLightGray shadow">
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="text-2xl focus:outline-none"
        >
          &#9776; {/* Hamburger icon */}
        </button>
        <h1 className="text-lg font-bold">WhatToDoApp</h1>
      </div>

      {/* Layout */}
      <div className="grid grid-cols-12 h-full">
        {/* Side Navigation */}
        <div
          className={`fixed inset-y-0 left-0 bg-pastelLightGray z-50 transform transition-transform duration-300 ease-in-out ${
            isMenuOpen ? "translate-x-0" : "-translate-x-full"
          } md:relative md:translate-x-0 md:col-span-3`}
        >
          {/* Close Button */}
          <div className="flex justify-between items-center p-4 md:hidden">
            <h2 className="font-bold text-lg">WhatToDoApp</h2>
            <button
              onClick={() => setIsMenuOpen(false)}
              className="text-xl focus:outline-none"
            >
              &#10005; {/* Close icon */}
            </button>
          </div>

          {/* Navigation Component */}
          <div onClick={() => setIsMenuOpen(false)} className="h-full">
            <Navigation />
          </div>
        </div>

        {/* Main Content */}
        <div className="col-span-12 md:col-span-9 overflow-y-hidden">
          <Outlet />
        </div>
      </div>

      {/* Overlay for closing menu */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setIsMenuOpen(false)}
        ></div>
      )}
    </div>
  );
};

export default Root;
