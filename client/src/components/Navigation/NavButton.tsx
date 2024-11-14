import { NavButtonProps } from "../../types";

const NavButton = ({ focusedBorderBottom, button }: NavButtonProps) => {
  return (
    <div className="flex">
      <div
        className={
          focusedBorderBottom ? "border border-success rounded-box" : ""
        }
      >
        <button className="btn btn-wide btn-outline border rounded-box">
          {button.title}
        </button>
      </div>
    </div>
  );
};

export default NavButton;
