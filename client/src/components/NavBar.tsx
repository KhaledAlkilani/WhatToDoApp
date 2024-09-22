import { useEffect, useState } from "react";
import { NavButtons } from "../types/index";
import menuButton from "../assets/align-right-svgrepo-com.svg";

const NavBar: React.FC<{}> = () => {
  const [focusedBorderBottom, setFocusedBorderBottom] = useState<string | null>(
    null
  );
  const [drawerOpen, setDrawerOpen] = useState<boolean>(false);
  const [isTabletWidth, setTabletWidth] = useState(
    () => window.innerWidth < 768
  );

  useEffect(() => {
    const handleSize = () => {
      setTabletWidth(window.innerWidth < 768);
      handleNavBarButtonClick("");
    };

    window.addEventListener("resize", handleSize);

    return () => {
      window.removeEventListener("resize", handleSize);
    };
  }, []);

  const handleNavBarButtonClick = (navButton: string) => {
    setFocusedBorderBottom(navButton);
  };

  return (
    <header className="bg-black p-6 h-24 flex items-center justify-between header">
      <div onClick={() => handleNavBarButtonClick("")} className="flex-1">
        <a className="btn btn-ghost text-xl text-white">WhatToDo</a>
      </div>

      {isTabletWidth ? (
        <>
          <div className="drawer drawer-end">
            <div className="drawer-content flex justify-end">
              <button
                className={`btn btn-ghost btn-circle ${
                  drawerOpen ? "fixed top-4 right-4 z-50" : ""
                }`}
                onClick={() => {
                  setDrawerOpen(!drawerOpen);
                  handleNavBarButtonClick("");
                }}
              >
                <img
                  src={menuButton}
                  width={24}
                  style={{
                    filter:
                      "invert(100%) sepia(0%) saturate(0%) hue-rotate(360deg)",
                  }}
                />
              </button>
            </div>
          </div>

          <div
            className={`fixed inset-0 z-40 transform ${
              drawerOpen ? "translate-x-0" : "translate-x-full"
            } transition-transform duration-300 ease-in-out bg-black bg-opacity-75`}
          >
            <div
              className="fixed inset-0 bg-black opacity-50"
              onClick={() => setDrawerOpen(false)}
            ></div>
            {/* Drawer content */}
            <div className="menu h-full w-full text-white p-4 flex items-center text-center">
              <ul className="menu menu-vertical px-2 text-white">
                {Object.values(NavButtons).map((navButton) => (
                  <li key={navButton} onClick={() => {}}>
                    <a>{navButton}</a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </>
      ) : (
        <ul className="menu menu-horizontal px-2 text-white flex gap-8">
          {Object.values(NavButtons).map((navButton) => (
            <li
              key={navButton}
              onClick={() => handleNavBarButtonClick(navButton)}
              className={focusedBorderBottom === navButton ? "border-b-2" : ""}
            >
              <a>{navButton}</a>
            </li>
          ))}
        </ul>
      )}
    </header>
  );
};

export default NavBar;
