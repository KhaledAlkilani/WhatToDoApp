import { useState } from "react";
import NavButton from "./NavButton";
import { navButtons } from "../../types";
import { Link, useLocation } from "react-router-dom";

const Navigation = () => {
  const location = useLocation();

  const [focusedButton, setFocusedButton] = useState(location.pathname);

  const handleFocusChange = (path: string) => {
    setFocusedButton(path);
  };

  return (
    <div className="flex flex-col items-center p-10 gap-4 border-r h-screen">
      <header className="mb-6">
        <span className="text-3xl font-extrabold">WhatToDoApp</span>
      </header>

      <>
        {navButtons.map((button) => (
          <Link key={button.id} to={button.to}>
            <NavButton
              key={button.id}
              button={button}
              focusedButton={focusedButton === button.to}
              onFocusChange={() => handleFocusChange(button.to)}
            />
          </Link>
        ))}
      </>
    </div>
  );
};

export default Navigation;
