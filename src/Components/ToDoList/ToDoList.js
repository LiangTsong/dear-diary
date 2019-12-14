import React from "react";

import Form from 'react-bootstrap/Form';
import Card from "react-bootstrap/Card";
import ListGroup from "react-bootstrap/ListGroup";

import './ToDoList.css';
import moment from "moment";
import Button from "react-bootstrap/Button";
import axios from "axios";
import {TODO_CHANGE, URL_ROOT} from "../../Constants";

class ToDoList extends React.Component {
    constructor(props){
        super(props);
        const my_todo_data = props.todo_data.slice();
        let i;
        for(i=0; i<my_todo_data.length; i++){
            my_todo_data[i].date = moment.unix((new Date(my_todo_data[i].date)).getTime()/1000)
                .format("YYYY年MM月DD日 HH时");
            my_todo_data[i].show = 1;
        }
        this.state = {
            todo_data: my_todo_data,
        };
    };

    async handleCheckChange(index, id) {
        // use json to deep copy
        let my_todo_data = JSON.parse(JSON.stringify(this.state.todo_data));

        if (my_todo_data[index].finished === 1) {
            // recover
            const post_data = {
              "id": id,
              "type": 2,
            };
            const response = await axios.post(
                URL_ROOT + TODO_CHANGE,
                post_data
            );

            if(response.data.success === 1){
                my_todo_data[index].expired = this.props.todo_data[index].expired;
                my_todo_data[index].finished = 0;

                this.setState({
                    todo_data: my_todo_data,
                })
            }else{
                this.props.setShowAlert(true, 1);
            }


        } else {
            // done
            const post_data = {
                "id": id,
                "type": 1,
            };
            const response = await axios.post(
                URL_ROOT + TODO_CHANGE,
                post_data
            );
            if(response.data.success === 1){
                my_todo_data[index].finished = 1;

                console.log('Change index ' + index + ' to finished.');

                this.setState({
                    todo_data: my_todo_data,
                })
            }else{
                this.props.setShowAlert(true, 1);
            }
        }
    };

    getDisplayMode(item){
        const display_style = ["none", "block"];
        return display_style[item.show];
    }

    async handleDeleteItem(index) {
        const post_data = {
            "id": this.state.todo_data[index].id,
            "type": 1,
        };
        const response = await axios.post(
            URL_ROOT + TODO_CHANGE,
            post_data
        );

        if(response.data.success === 1){
            const my_todo_data = JSON.parse(JSON.stringify(this.state.todo_data));
            my_todo_data[index].show = 0;
            console.log(my_todo_data);
            this.setState({
                todo_data: my_todo_data,
            });
        }else{
            this.props.setShowAlert(true, 1);
        }
    }

    render() {
        const status_to_checked = {
            0: false,
            1: true,
        };

        const todos = this.state.todo_data.map((item, index) =>
            <ListGroup.Item key={index} style={{display: this.getDisplayMode(item)}}>
                <Form.Check type="checkbox" id={`checkbox-for-${item.content}`}>
                    <Form.Check.Input type="checkbox"
                                      checked={status_to_checked[item.finished]}
                                      onChange={()=>this.handleCheckChange(index, item.id)}/>
                    <Form.Check.Label className="to-do-item">
                        <div className={(item.finished) ? `to-do-item-content-finished`: `to-do-item-content-expired-${item.expired}`}>
                            {item.content}
                            <Button className="to-do-list-delete"
                                    size="sm"
                                    variant="outline-dark" onClick={()=>this.handleDeleteItem(index)}>
                                <div className="to-do-list-delete-text">X</div>
                            </Button>
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