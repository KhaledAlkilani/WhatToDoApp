import { NavButtonProps } from "../../types";

const NavButton = ({
  focusedButton,
  button,
  onFocusChange,
}: NavButtonProps) => {
  return (
    <button
      onClick={() => onFocusChange(button.id)}
      className={`btn btn-wide btn-primary tracking-wider text-whity ${
        focusedButton ? "bg-pastelGray" : ""
      }`}
    >
      {button.title}
    </button>
  );
};

export default NavButton;
