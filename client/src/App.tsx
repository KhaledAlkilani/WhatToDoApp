import { BrowserRouter, Route, Routes } from "react-router-dom";
import Root from "./routes/Root";
import Dashboard from "./routes/Dashboard";
import ReactDOM from "react-dom/client";
import Tasks from "./components/Tasks";
import ErrorPage from "./components/ErrorPage";

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

const rootElement = document.getElementById("root");
if (!rootElement) throw new Error("Failed to find the root element");

const root = ReactDOM.createRoot(rootElement);
root.render(<App />);
