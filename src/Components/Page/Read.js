import React from "react";

import {URL_ROOT, GET_DIARY} from "../../Constants";

import MainEditor from "../Editor/MainEditor";
import moment from "moment";
import "./Write.css"
import Alert from "react-bootstrap/Alert";
import Spinner from "react-bootstrap/Spinner";
import axios from "axios";
import Button from "react-bootstrap/Button";
import {Link} from "react-router-dom";

class Read extends React.Component {

    constructor(props){
        super(props);

        this.state={
            alert_str: ["发生错误：无法读取日记。"],
            alert_type: -1,
            show_alert: false,
            date: -1,
            raw_text: '',
            object_text: '',
            id: null,
            diary_type: 0,
            editor_todo_data:[
            ],
            status: -1,
        }
    }

    async componentDidMount() {
        // const my_text = '{"raw_text":"\\"你好，世界。\\"","object_text":{"blocks":[{"key":"1240c","text":"你好，世界。","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}}],"entityMap":{}},"id":5}';

        this.setState({
            status: -1,
            alert_type: -1,
            id: this.props.match.params.id,
            show_alert: false,
        });

        // POST
        const post_data = {
            "id": this.props.match.params.id,
        };
        const response = await axios.post(
            URL_ROOT+GET_DIARY,
            post_data
        );

        console.log(post_data);
        console.log(response.data);
        if (response.data.success === 1) {
            console.log(response.data);
            if(response.data.object_text.length < 10){
                this.setState({
                    id: this.props.id,
                    status: 0,
                    diary_type: 1,
                    date: moment.unix(parseInt(response.data.date, 10)).format("YYYY年MM月DD日"),
                });
            }else {
                this.setState({
                    id: this.props.id,
                    object_text: JSON.parse(response.data.object_text),
                    status: 0,
                    diary_type: 0,
                    date: moment.unix(parseInt(response.data.date, 10)).format("YYYY年MM月DD日"),
                });
            }
        }else{
            this.setState({
                show_alert: true,
                alert_type: 0,
            });
        }

        // const my_text = '{"raw_text":"\\"你好，世界。\\"","object_text":{"blocks":[{"key":"1240c","text":"你好，世界。","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}}],"entityMap":{}},"id":5}';
        // console.log(JSON.parse(my_text).object_text);
        // this.setState({
        //     id: 5,
        //     object_text: JSON.parse(my_text).object_text,
        //     diary_type: 0,
        //     status: 0,
        // });
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

    generateContent(){
        if(this.state.status === 0){
            return(
                <div className="main-editor">
                    <div className="main-editor-date">
                        {this.state.date}
                    </div>
                    <div>
                        <MainEditor handleTextChange={(text, obj)=>this.handleTextChange(text, obj)}
                                    editorState={this.state.object_text}
                                    diary_type={this.state.diary_type}
                                    readOnly={true}>
                        </MainEditor>
                    </div>
                </div>
            );
        }else{
            return(
                <Spinner animation="grow" className="main-editor-spinner"/>
            );
        }
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
                    阅读
                    <Link to={"/"}>
                        <Button className="read-screen-header-home-link"
                                variant="outline-info">返回</Button>
                    </Link>
                </header>
                {this.generateContent()}
            </div>
        );
    }
}

export default Read;