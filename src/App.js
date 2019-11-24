import React from "react";

import Jumbotron from "react-bootstrap/Jumbotron";
import Container from "react-bootstrap/Container";

import "./App.css";
// import FeedItem from "./Components/Dashboard/FeedItem";
import MainEditor from "./Components/Editor/MainEditor";

const App = () => (
    <Container className="p-3">
        <Jumbotron>
            <h1 className="header">测试</h1>
            <MainEditor className="toast">
                <span role="img" aria-label="tada">
          🎉
        </span>
            </MainEditor>
        </Jumbotron>
    </Container>
);

export default App;