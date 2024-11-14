import { Outlet } from "react-router-dom";
import Navigation from "../components/Navigation/Navigation";

const Root = () => {
  return (
    <div className="container flex">
      <div className="w-1/4">
        <Navigation />
      </div>
      <div className="w-3/4">
        <Outlet />
      </div>
    </div>
  );
};

export default Root;
