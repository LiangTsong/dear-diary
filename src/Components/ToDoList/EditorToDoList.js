import React from "react";

import  { Redirect } from 'react-router-dom';

import Form from 'react-bootstrap/Form';
import Card from "react-bootstrap/Card";
import ListGroup from "react-bootstrap/ListGroup";
import DateTimePicker from "react-datetime-picker";
import new_item_img from "../../../data/img/plus-26.png";

import './EditorToDoList.css';
import Button from "react-bootstrap/Button";
import axios from "axios";
import {SUBMIT_TODO, URL_ROOT} from "../../Constants";

class EditorToDoList extends React.Component {
    constructor(props){
        super(props);
        const editor_todo_data = props.editor_todo_data.slice();
        let i = 0;
        for (i=0; i<editor_todo_data.length; i++){
            editor_todo_data[i].show=1;
        }
        this.state = {
            todo_data: editor_todo_data,
            status: 0,
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

    handleDeleteItem(index){
        const my_todo_data = JSON.parse(JSON.stringify(this.state.todo_data));
        const my_index = JSON.parse(JSON.stringify(index));
        my_todo_data[my_index.index].show = 0;
        this.setState({
            todo_data: my_todo_data,
        });
    }

    handleNewItem(){
        let my_todo_data = this.state.todo_data;
        let new_item = {
            date: new Date(),
            content: '',
            id: 0,
            show: 1,
        };
        my_todo_data.unshift(new_item);
        this.setState({
            todo_data: my_todo_data,
        });
    }

    getShow(index){
        const show_str = ['none', 'block'];
        return show_str[this.state.todo_data[index].show];
    }

    async handleSaveTodo() {
        const my_todo_data = JSON.parse(JSON.stringify(this.state.todo_data));
        const post_todo_data = [];
        let i;
        for (i = 0; i < my_todo_data.length; i++) {
            if (my_todo_data[i].show === 1) {
                let new_item = {
                    date: new Date(my_todo_data[i].date).getTime(),
                    content: my_todo_data[i].content,
                };
                post_todo_data.push(JSON.parse(JSON.stringify(new_item)));
            }
        }

        const post_data = {
            "todo_data": post_todo_data,
        };

        const response = await axios.post(
            URL_ROOT + SUBMIT_TODO,
            post_data
        );

        console.log(post_data);

        if(response.data.success === 1){
            this.setState({
                status: 1,
            });
        }else{
            this.props.setAlertType(3);
            this.props.setShowAlert(true);
        }
    }



    render() {

        if (this.state.status === 1) {
            return <Redirect to={'/'} />
        }

        const todos = this.state.todo_data.map((item, index) =>
            <ListGroup.Item key={index} className="main-editor-to-do-list-item" style={{display: this.getShow(index)}}>
                <Form.Group>
                    <Form.Label className="main-editor-to-do-list-content-time-title">事项</Form.Label>
                    <Button className="to-do-list-delete"
                            size="sm"
                            variant="outline-dark" onClick={()=>this.handleDeleteItem({index})}>
                        <div className="to-do-list-delete-text">X</div>
                    </Button>
                    <Form.Control type="text" placeholder="提醒事项"
                                  value={item.content}
                                  onChange={(e)=>this.handleTDContentChange(e, index, item.id)}/>

                    <Form.Label className="main-editor-to-do-list-content-time-title">时间</Form.Label>
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
                    <img className="to-do-list-box-new-button"
                         src={new_item_img}
                         height="30px"
                         width="30px"
                         alt="new-item" onClick={()=>this.handleNewItem()}/>
                    <ListGroup>
                        {todos}
                        <Button className="to-do-list-submit" variant="secondary" onClick={()=>this.handleSaveTodo()}>保存</Button>
                    </ListGroup>
                </Card>
            </div>
        )
    }
}

export default EditorToDoList;