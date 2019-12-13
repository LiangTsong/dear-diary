import React from "react";

import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";

import FeedItem from "../Dashboard/FeedItem";
import ToDoList from "../ToDoList/ToDoList";

import "./Home.css"
import axios from "axios";
import {USER_INFO, URL_ROOT, GET_TODO, INFO_FLOW} from "../../Constants";
import Alert from "react-bootstrap/Alert";
import Spinner from "react-bootstrap/Spinner";
import moment from "moment";

class Home extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            alert_type_str: ["发生错误：服务器无法获取信息。", "发生错误：无法对提醒事项进行操作。"],
            user_img: '',
            status: 0,
            user_name: '',
            show_alert: false,
            alert_type: 0,
            feed_item_data: [
            ],
            todo_data:[
            ],
        }
    }

    async componentDidMount() {
        this.setState({
            user_img: '',
            status: 0,
            user_name: '',
            show_alert: false,
            alert_type: 0,
        });

        const post_data = {};
        // user_info
        const response_1 = await axios.post(
            URL_ROOT + USER_INFO,
            post_data
        );

        if(response_1.data.success === 1){
            this.setState({
                user_img: response_1.data.user_img,
                user_name: response_1.data.user_name,
            })
        }else{
            this.setState({
                show_alert: true,
            })
        }

        console.log(response_1.data.user_img);

        // todo_list
        const response_2 = await axios.post(
            URL_ROOT + GET_TODO,
            post_data
        );

        if(response_2.data.success === 1){
            this.setState({
                todo_data: response_2.data.todo_data,
            })
        }else{
            this.setState({
                show_alert: true,
                status: 1,
            })
        }

        // info_flow
        const response_3 = await axios.post(
            URL_ROOT + INFO_FLOW,
            post_data
        );

        if(response_3.data.success === 1){
            this.setState({
                feed_item_data: response_3.data.feed_item_data,
                status: 1,
            })
        }else{
            this.setState({
                show_alert: true,
                status: 1,
            })
        }
    }

    setShowAlert(b, i){
        this.setState({
            show_alert: b,
            alert_type: i,
        })
    }

    generateAlertBar(){
        if(this.state.show_alert){
            return(
                <Alert variant="danger" onClose={() => this.setShowAlert(false, 0)} dismissible>
                    {this.state.alert_type_str[this.state.alert_type]}
                </Alert>
            );
        }
    }

    generateBody(){
        const feed_items = this.state.feed_item_data.map((item, key)=>
            <FeedItem key={key}
                      date={moment.unix((new Date(item.date)).getTime()/1000)
                          .format("YYYY年MM月DD日")}
                      user_name={item.user_name}
                      user_img={item.user_img}
                      digest={item.digest}
                      emotion={item.emotion}
                      score={item.score}/>
        );

        if(this.state.status === 0){
            return(
                <Spinner className="home-page-spinner" animation="grow" />
            );
        }else if(this.state.status === 1){
            return(
                <div className="home-screen-content">
                    <Row>
                        <Col sm={4} xs={6}>
                            <div className="home-screen-user-img-and-write-button">
                                <img src={this.state.user_img} alt="user_img"
                                     className="home-screen-user-img" width={225} height={225}/>
                                <Button variant="outline-success"
                                        className="home-screen-write-button-1"
                                        href="/write">
                                    写日记
                                </Button>
                                <Button variant="outline-warning"
                                        className="home-screen-write-button-2"
                                        href="/write_p">
                                    特权写日记
                                </Button>
                                <div className="home-screen-to-do-list">
                                    <ToDoList todo_data={this.state.todo_data}
                                              setShowAlert={(b, i)=>this.setShowAlert(b, i)}>
                                    </ToDoList>
                                </div>
                            </div>
                        </Col>
                        <Col sm={8} xs={12} className="home-feed-flow">
                            <div>

                                {feed_items}

                            </div>
                        </Col>
                    </Row>
                </div>
            );
        }
    }

    render() {

        return (
            <div>
                {this.generateAlertBar()}
                <header className="home-screen-header">
                    日记
                </header>
                {this.generateBody()}
            </div>
        )
    }
}

export default Home;