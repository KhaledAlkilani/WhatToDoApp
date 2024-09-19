import { useState } from "react";

enum NavButtons {
  About = "About",
  Works = "Works",
  Skills = "Skills",
  Contact = "Contact",
}

const NavBar: React.FC<{}> = () => {
  const [focusedBorderBottom, setFocusedBorderBottom] = useState<string | null>(
    null
  );

  const handleNavBarButtonClick = (navButton: string) => {
    setFocusedBorderBottom(navButton);
  };

  return (
    <>
      <div className="navbar bg-info p-4 border-orange-300">
        <div onClick={() => handleNavBarButtonClick("")} className="flex-1">
          <a className="btn btn-ghost text-xl">Khaled Alkilani</a>
        </div>
        <div className="flex-none">
          <ul className="menu menu-horizontal px-2">
            {Object.values(NavButtons).map((navButton) => (
              <li
                key={navButton}
                onClick={() => handleNavBarButtonClick(navButton)}
                className={
                  focusedBorderBottom === navButton ? "border-b-2" : ""
                }
              >
                <a>{navButton}</a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
};

export default NavBar;
