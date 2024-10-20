import { NavButtonProps } from "../types";

const NavButton: React.FC<NavButtonProps> = (props) => {
  const { button, focusedBorderBottom } = props;

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
