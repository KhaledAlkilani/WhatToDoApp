import { useRouteError } from "react-router-dom";
import errorIcon from "../assets/error-905.svg";

const ErrorPage: React.FC<{}> = () => {
  let error = useRouteError();
  console.error(error);

  return (
    <div className="flex direction-row">
      <div className="flex">
        <h1>404 - page not found</h1>
        <img src={errorIcon} alt="" />
      </div>
      <p>The page you are looking for doesn't exist.</p>
    </div>
  );
};

export default ErrorPage;
