import { Outlet } from "react-router-dom";
import Navigation from "../components/Navigation/Navigation";

const Root = () => {
  return (
    <div className="grid grid-cols-12 h-screen">
      <div className="col-span-3 bg-pastelLightGray">
        <Navigation />
      </div>
      <div className="col-span-9 overflow-y-hidden">
        <Outlet />
      </div>
    </div>
  );
};

export default Root;
