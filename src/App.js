import React from "react";
import {
    BrowserRouter as Router,
    Switch,
    Route,
} from "react-router-dom";

import Container from "react-bootstrap/Container";

// import "./App.css";
// import FeedItem from "./Components/Dashboard/FeedItem";
import PolarityEmotionChart from "./Components/Chart/PolarityEmotionChart";
// import MainEditor from "./Components/Editor/MainEditor";
import Home from "./Components/Page/Home";
import Write from "./Components/Page/Write";

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

function Chart(){
    return (
        <Container className="">
            <PolarityEmotionChart className="">
            </PolarityEmotionChart>
        </Container>
    )
}


export default App;