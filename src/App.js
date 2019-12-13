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

    function App(){
        return(
            <div>
                <Helmet>
                    <meta charSet={"utf-8"}/>
                    <title>Dear Diary</title>
                </Helmet>
                <Router basename={process.env.PUBLIC_URL}>
                    <div>
                        <Switch>
                            <Route exact path="/" component={Home}/>
                            <Route exact path="/write" component={Write}/>
                            <Route exact path="/write_p" component={WriteP}/>
                            <Route exact path="/chart" component={Chart}/>
                        </Switch>
                    </div>
                </Router>
                <div className="copyright-footage">
                    Copyright © 2019 Liang Cong & Ye Ziyi All rights reserved.
                </div>
            </div>
        );
}


export default App;