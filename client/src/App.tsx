import { BrowserRouter, Route, Routes } from "react-router-dom";
import Root from "./routes/Root";
import Dashboard from "./routes/Dashboard";
import Tasks from "./components/Tasks/Tasks";
import ErrorPage from "./components/ErrorPage";

// just to make a pull request for this branch

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Root />}>
          <Route index element={<Dashboard />} />
          <Route path="tasks" element={<Tasks />} />
          <Route path="*" element={<ErrorPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
