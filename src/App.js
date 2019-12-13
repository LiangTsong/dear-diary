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
import {Helmet} from "react-helmet";
import WriteP from "./Components/Presentation/WriteP";

const App = () => (
    <div>
        <Helmet>
            <title>Dear Diary</title>
        </Helmet>
        <Router>
            <div>
                <Switch>
                    <Route path="/dear-diary/chart">
                        <Chart />
                    </Route>
                    <Route path="/dear-diary/write">
                        <Write />
                    </Route>
                    <Route path="/dear-diary/write_p">
                        <WriteP />
                    </Route>
                    <Route path="/dear-diary/">
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