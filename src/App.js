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
                    <Route path={process.env.PUBLIC_URL + '/chart'}>
                        <Chart />
                    </Route>
                    <Route path={process.env.PUBLIC_URL + '/write'}>
                        <Write />
                    </Route>
                    <Route path={process.env.PUBLIC_URL + '/write_p'}>
                        <WriteP />
                    </Route>
                    <Route path={process.env.PUBLIC_URL + '/'}>
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