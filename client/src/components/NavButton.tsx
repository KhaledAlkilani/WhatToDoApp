import { NavButtonProps } from "../types";

const NavButton: React.FC<NavButtonProps> = (props) => {
  const { button, focusedBorderBottom } = props;

  return (
    <ul className="px-2 text-center text-black flex flex-col gap-10 items-center">
      <li className={focusedBorderBottom ? "border-b-2 border-info" : ""}>
        <button className="w-full">{button.title}</button>
      </li>
    </ul>
  );
};

export default NavButton;
