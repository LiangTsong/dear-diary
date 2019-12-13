import React from "react";

import {URL_ROOT, NEW_DIARY, SUBMIT_DIARY} from "../../Constants";

import Button from "react-bootstrap/Button";

import MainEditor from "../Editor/MainEditor";
import moment from "moment";
import EditorToDoList from "../ToDoList/EditorToDoList";
import "./Write.css"
import Alert from "react-bootstrap/Alert";
import Spinner from "react-bootstrap/Spinner";
import axios from "axios";

class Write extends React.Component {

    constructor(props){
        super(props);

        this.state={
            alert_str: ["发生错误：没有日记实例。", "发生错误：无法获取新建日记状态。", "发生错误：日记分析出现问题。",
                "发生错误：无法保存提醒事项。"],
            alert_type: -1,
            show_alert: false,
            date: moment.unix((new Date()).getTime()/1000).format("YYYY年MM月DD日"),
            raw_text: '',
            object_text: '',
            id: null,
            editor_todo_data:[
            ],
            status: -1,
        }
    }

    async componentDidMount() {
        this.setState({
            status: -1,
            alert_type: -1,
            show_alert: false,
        });

        // POST
        const post_data = {};
        const response = await axios.post(
            URL_ROOT+NEW_DIARY,
            post_data
        );

        console.log(response.data);
        if (response.data.success === 1) {
            this.setState({
                id: response.data.id,
                object_text: response.data.object_text,
                status: 0,
            });
        }else{
            this.setState({
                show_alert: true,
                alert_type: 1,
            });
        }
    }

    setShowAlert(b){
        this.setState({
            show_alert: b,
        })
    }

    setAlertType(t){
        this.setState({
            alert_type: t,
        })
    }

    async handleSaveDiary() {
        if (this.state.id === null) {
            this.setState({
                show_alert: true,
                alert_type: 0,
            });
            return;
        }
        this.setState({
            status: 1,
        });
        const post_data = {
            raw_text: this.state.raw_text,
            object_text: this.state.object_text,
            id: this.state.id,
        };

        console.log(post_data);

        const response = await axios.post(
            URL_ROOT + SUBMIT_DIARY,
            post_data
        );

        console.log(response.data);

        if(response.data.success === 1) {
            let i;
            for(i=0; i<response.data.todo_data.length; i++){
                response.data.todo_data[i].date = new Date(response.data.todo_data[i].date);
            }
            this.setState({
                editor_todo_data: response.data.todo_data,
                status: 2,
            })
        }else{
            this.setState({
                show_alert: true,
                alert_type: 2,
                status: 0,
            });
        }
    }

    generateContent(){
        if(this.state.status === 0 || this.state.status === 1){
            return(
                <div className="main-editor">
                    <div className="main-editor-date">
                        {this.state.date}
                    </div>
                    <div>
                        <MainEditor handleTextChange={(text, obj)=>this.handleTextChange(text, obj)}
                                    editorState={this.state.object_text}>
                        </MainEditor>
                    </div>
                </div>
            );
        }else if(this.state.status === 2){
            return(
                <div className="main-editor-to-do-list">
                    <EditorToDoList editor_todo_data={this.state.editor_todo_data}
                                    setAlertType={(t)=>this.setAlertType(t)}
                                    setShowAlert={(b)=>this.setShowAlert(b)}/>
                </div>
            );
        }else{
            return(
                <Spinner animation="grow" className="main-editor-spinner"/>
            );
        }
    }

    generateButton() {
        let button;
        if(this.state.status === 0){
            button = (
                <Button variant="success" className="main-editor-finish-button"
                        onClick={()=>this.handleSaveDiary()}>
                    完成
                </Button>
            );
        }else if(this.state.status === 1){
            button = (
                <Button variant="success" className="main-editor-finish-button"
                        disabled={true}>
                    <Spinner
                        as="span"
                        animation="grow"
                        size="sm"
                        role="status"
                        aria-hidden="true"
                    />
                    稍等
                </Button>
            );
        }
        return button;
    }

    handleTextChange(raw_text, object_text){
        this.setState({
            raw_text: raw_text,
            object_text: object_text,
        });
    }

    generateAlertBar(){
        if(this.state.show_alert){
            return(
                <Alert variant="danger" onClose={() => this.setShowAlert(false)} dismissible>
                    {this.state.alert_str[this.state.alert_type]}
                </Alert>
            );
        }
    }

    render() {

        return(
            <div>
                {this.generateAlertBar()}
                <header className="main-editor-page-header">
                    记录
                    {this.generateButton()}
                </header>
                {this.generateContent()}
            </div>
        );
    }
}

export default Write;