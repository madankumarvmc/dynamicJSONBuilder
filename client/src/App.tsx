import { AppProvider } from "./context/AppContext";
import DynamicJsonGenerator from "./components/DynamicJsonGenerator";
import "./index.css";

function App() {
  return (
    <AppProvider>
      <DynamicJsonGenerator />
    </AppProvider>
  );
}

export default App;
