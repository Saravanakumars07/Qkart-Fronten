import { Route, Switch } from "react-router-dom";
import Login from "./components/Login";
import Products from "./components/Products";
import Register from "./components/Register";
import Checkout from "./components/Checkout";
import ipConfig from "./ipConfig.json";
import { ThemeProvider } from "@mui/material/styles";
import theme from "./theme";

export const config = {
  endpoint: `http://${ipConfig.workspaceIp}:8082/api/v1`,



//export const config = {
  // endpoint: `http://${ipConfig.workspaceIp}:8082/api/v1`,
//57633de7823f44ff2260ca771a8d347f6cd66601
};

function App() {
  return (
    <div className="App">
      <ThemeProvider theme={theme}>
        <Switch>
          <Route exact path="/" component={Products} />
          <Route path="/register" component={Register} />
          <Route path="/login" component={Login} />
          <Route path="/checkout" component={Checkout} />
          <Route component={() => <div>404 Not Found</div>} />
        </Switch>
      </ThemeProvider>
    </div>
  );
// 57633de7823f44ff2260ca771a8d347f6cd66601
  
  };
export default App;
