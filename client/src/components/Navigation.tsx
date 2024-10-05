import { useEffect, useState } from "react";
import NavButton from "./NavButton";
import { navButtons } from "../types";
import { Link, useLocation } from "react-router-dom";

const Navigation: React.FC<{}> = () => {
  const location = useLocation();

  const [focusedBorderBottom, setFocusedBorderBottom] = useState(
    location.pathname
  );

  useEffect(() => {
    setFocusedBorderBottom(location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex flex-col p-10 gap-12 border-r h-screen">
      <header className="text-center">
        <span className="text-xl text-black font-bold">WhatToDoApp</span>
      </header>

      <>
        {navButtons.map((button) => (
          <Link key={button.id} to={button.to}>
            <NavButton
              key={button.id}
              button={button}
              focusedBorderBottom={focusedBorderBottom === button.to}
            />
          </Link>
        ))}
      </>
    </div>
  );
};

export default Navigation;
