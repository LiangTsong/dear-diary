import React from "react";

import Button from "react-bootstrap/Button";

import MainEditor from "../Editor/MainEditor";
import EditorToDoList from "../ToDoList/EditorToDoList";
import "./Write.css"

class Write extends React.Component {
    constructor(props){
        super(props);
        this.state={
            date: "2019年12月31日 00:00",
        }
    }

    render() {

        const editor_todo_data=[
            {
                date: new Date(),
                content: '2019年最后一天',
                id: 0,
            },
            {
                date: new Date(),
                content: '2019年最后一天',
                id: 1,
            },
            {
                date: new Date(),
                content: '2019年最后一天',
                id: 2,
            },
            {
                date: new Date(),
                content: '2019年最后一天',
                id: 3,
            },
        ];

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
                    <div>
                        <div className="main-editor-to-do-list">
                            <EditorToDoList editor_todo_data={editor_todo_data}/>
                        </div>
                        <MainEditor className="">
                        </MainEditor>
                    </div>
                </div>
            </div>
        );
    }
}

export default Write;