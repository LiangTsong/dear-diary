import React from "react";

import Button from "react-bootstrap/Button";

import MainEditor from "../Editor/MainEditor";
import "./Write.css"

class Write extends React.Component {
    constructor(props){
        super(props);
        this.state={
            date: "2019年12月31日 00:00",
        }
    }

    render() {

        return(
            <div>
                <header className="main-editor-page-header">
                    记录
                    <Button variant="success" className="main-editor-finish-button">完成</Button>
                </header>
                <div className="main-editor">
                    <div className="main-editor-date">
                        {this.state.date}
                    </div>
                    <MainEditor className="">
                    </MainEditor>
                </div>
            </div>
        );
    }
}

export default Write;