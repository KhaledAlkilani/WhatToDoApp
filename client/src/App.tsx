import NavBar from "./components/NavBar";
import TaskForm from "./components/TaskForm";

const App: React.FC<{}> = () => {
  return (
    <div className="md:container md:mx-auto">
      <NavBar />
      <TaskForm />
    </div>
  );
};

export default App;

/* Erillaisia tyylejä määritellä React komponentteja / funktioita
  function App() {}
  const App = () => {}
  export default function App() {}
*/
