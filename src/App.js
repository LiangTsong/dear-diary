import React from "react";
import {
    BrowserRouter as Router,
    Switch,
    Route,
} from "react-router-dom";

import Home from "./Components/Page/Home";
import Write from "./Components/Page/Write";
import Chart from "./Components/Page/Chart";

const App = () => (
    <Router>
        <div>
            <Switch>
                <Route path="/chart">
                    <Chart />
                </Route>
                <Route path="/write">
                    <Write />
                </Route>
                <Route path="/">
                    <Home />
                </Route>
            </Switch>
        </div>
    </Router>
)


export default App;