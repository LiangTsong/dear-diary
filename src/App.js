import React from "react";
import {
    BrowserRouter as Router,
    Switch,
    Route,
} from "react-router-dom";

import Home from "./Components/Page/Home";
import Write from "./Components/Page/Write";
import Chart from "./Components/Page/Chart";

import "./App.css";

const App = () => (
    <div>
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
        <div className="copyright-footage">
            Copyright © 2019 Liang Cong & Ye Ziyi All rights reserved.
        </div>
    </div>
)


export default App;