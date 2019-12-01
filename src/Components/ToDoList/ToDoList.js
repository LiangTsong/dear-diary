import React from "react";

import Form from 'react-bootstrap/Form';
import Card from "react-bootstrap/Card";
import ListGroup from "react-bootstrap/ListGroup";

import './ToDoList.css';

class ToDoList extends React.Component {
    constructor(props){
        super(props);
        const my_todo_data = props.todo_data.slice();
        this.state = {
            todo_data: my_todo_data,
        };
    };

    handleCheckChange(index, id){
        // use json to deep copy
        let my_todo_data = JSON.parse(JSON.stringify(this.state.todo_data));

        if(my_todo_data[index].finished === 1){
            // recover
            my_todo_data[index].expired = this.props.todo_data[index].expired;
            my_todo_data[index].finished = 0;

            console.log('Change index ' + index + ' to unfinished.');

            this.setState({
                todo_data: my_todo_data,
            })
        }else{
            // done
            my_todo_data[index].finished = 1;

            console.log('Change index ' + index + ' to finished.');

            this.setState({
                todo_data: my_todo_data,
            })
        }
    };

    render() {
        const status_to_checked = {
            0: false,
            1: true,
        };

        const todos = this.state.todo_data.map((item, index) =>
            <ListGroup.Item key={index}>
                <Form.Check type="checkbox" id={`checkbox-for-${item.content}`}>
                    <Form.Check.Input type="checkbox"
                                      checked={status_to_checked[item.finished]}
                                      onChange={()=>this.handleCheckChange(index, item.id)}/>
                    <Form.Check.Label className="to-do-item">
                        <div className={(item.finished) ? `to-do-item-content-finished`: `to-do-item-content-expired-${item.expired}`}>
                            {item.content}
                        </div>
                        <div className="to-do-item-date">
                            {item.date}
                        </div>
                    </Form.Check.Label>
                </Form.Check>
            </ListGroup.Item>
        );

        return(
            <div>
                <Card className="to-do-list-box">
                    <Card.Header className="to-do-list-box-header">日记中的提醒事项</Card.Header>
                    <ListGroup>
                        {todos}
                    </ListGroup>
                </Card>
            </div>
        )
    }
}

export default ToDoList;