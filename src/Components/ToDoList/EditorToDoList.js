import React from "react";

import Form from 'react-bootstrap/Form';
import Card from "react-bootstrap/Card";
import ListGroup from "react-bootstrap/ListGroup";
import DateTimePicker from "react-datetime-picker";

import './EditorToDoList.css';
import Button from "react-bootstrap/Button";

class EditorToDoList extends React.Component {
    constructor(props){
        super(props);
        const editor_todo_data = props.editor_todo_data.slice();
        this.state = {
            todo_data: editor_todo_data,
        };
    };

    handleDateTimeChange(value, index, id){
        let my_todo_data = this.state.todo_data;
        my_todo_data[index].date = value;
        this.setState({
            todo_data: my_todo_data,
        });
    }

    handleTDContentChange(e, index, id){
        let my_todo_data = this.state.todo_data;
        my_todo_data[index].content = e.target.value;
        this.setState({
            todo_data: my_todo_data,
        });
    }

    render() {

        const todos = this.state.todo_data.map((item, index) =>
            <ListGroup.Item key={index}>
                <Form.Group>
                    <Form.Label>事项</Form.Label>
                        <Button className="to-do-list-delete" size="sm" variant="outline-dark">
                            <div className="to-do-list-delete-text">X</div>
                        </Button>
                    <Form.Control type="text" placeholder="提醒事项"
                                  value={item.content}
                                  onChange={(e)=>this.handleTDContentChange(e, index, item.id)}/>

                    <Form.Label className="main-editor-to-do-list-time-title">时间</Form.Label>
                    <DateTimePicker className="main-editor-to-do-list-date-time-picker"
                                    value={item.date}
                                    onChange={(e)=>this.handleDateTimeChange(e, index, item.id)}/>
                </Form.Group>
            </ListGroup.Item>
        );

        return(
            <div>
                <Card className="to-do-list-box">
                    <Card.Header className="to-do-list-box-header">自动提取的提醒事项</Card.Header>
                    <ListGroup>
                        {todos}
                        <Button className="to-do-list-submit" variant="secondary">保存</Button>
                    </ListGroup>
                </Card>
            </div>
        )
    }
}

export default EditorToDoList;