import NavBar from "./components/NavBar";

const App: React.FC<{}> = () => {
  return (
    <div className="container mx-auto">
      <NavBar />
    </div>
  );
};

export default App;

/* Erillaisia tyylejä määritellä React komponentteja / funktioita
  function App() {}
  const App = () => {}
  export default function App() {}
*/
