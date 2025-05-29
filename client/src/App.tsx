import { Route, Switch } from "wouter";
import { AppProvider } from "./context/AppContext";
import DynamicJsonGenerator from "./components/DynamicJsonGenerator";
import Documentation from "./pages/Documentation";
import NotFound from "./pages/not-found";
import "./index.css";

function App() {
  return (
    <AppProvider>
      <Switch>
        <Route path="/docs/:section?/:page?" component={Documentation} />
        <Route path="/docs" component={Documentation} />
        <Route path="/" component={DynamicJsonGenerator} />
        <Route component={NotFound} />
      </Switch>
    </AppProvider>
  );
}

export default App;
