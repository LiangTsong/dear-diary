import React from "react";

import Jumbotron from "react-bootstrap/Jumbotron";
import Container from "react-bootstrap/Container";

import "./App.css";
// import FeedItem from "./Components/Dashboard/FeedItem";
import PolarityEmotionChart from "./Components/Chart/PolarityEmotionChart";

const App = () => (
    <Container className="p-3">
        <Jumbotron>
            <h1 className="header">测试</h1>
            <PolarityEmotionChart className="toast">
                <span role="img" aria-label="tada">
          🎉
        </span>
            </PolarityEmotionChart>
        </Jumbotron>
    </Container>
);

export default App;