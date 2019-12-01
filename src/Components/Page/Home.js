import React from "react";

// import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";

import FeedItem from "../Dashboard/FeedItem";
import ToDoList from "../ToDoList/ToDoList";

import "./Home.css"
import user_img from "../../../data/img/user_img_generic.jpeg"

class Home extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            user_img: user_img,
            feed_item_data: [
                {
                    date:"2019-12-31 00:00",
                    user_name:"我自己",
                    user_img:user_img,
                    digest: '今天是快乐的一天，我写完了作业，吃了好吃的，看了电影，喝了奶茶，还去了游乐场。',
                    emotion: '😀',
                    score: '⬤',
                },
                {
                    date:"2019-12-31 00:00",
                    user_name:"我自己",
                    user_img:user_img,
                    digest: '今天是快乐的一天，我写完了作业，吃了好吃的，看了电影，喝了奶茶，还去了游乐场。',
                    emotion: '😀',
                    score: '⬤',
                },
                {
                    date:"2019-12-31 00:00",
                    user_name:"我自己",
                    user_img:user_img,
                    digest: '今天是快乐的一天，我写完了作业，吃了好吃的，看了电影，喝了奶茶，还去了游乐场。',
                    emotion: '😀',
                    score: '⬤',
                },
                {
                    date:"2019-12-31 00:00",
                    user_name:"我自己",
                    user_img:user_img,
                    digest: '今天是快乐的一天，我写完了作业，吃了好吃的，看了电影，喝了奶茶，还去了游乐场。',
                    emotion: '😀',
                    score: '⬤',
                },
                {
                    date:"2019-12-31 00:00",
                    user_name:"我自己",
                    user_img:user_img,
                    digest: '今天是快乐的一天，我写完了作业，吃了好吃的，看了电影，喝了奶茶，还去了游乐场。',
                    emotion: '😀',
                    score: '⬤',
                },
                {
                    date:"2019-12-31 00:00",
                    user_name:"我自己",
                    user_img:user_img,
                    digest: '今天是快乐的一天，我写完了作业，吃了好吃的，看了电影，喝了奶茶，还去了游乐场。',
                    emotion: '😀',
                    score: '⬤',
                },
                {
                    date:"2019-12-31 00:00",
                    user_name:"我自己",
                    user_img:user_img,
                    digest: '今天是快乐的一天，我写完了作业，吃了好吃的，看了电影，喝了奶茶，还去了游乐场。',
                    emotion: '😀',
                    score: '⬤',
                },
                {
                    date:"2019-12-31 00:00",
                    user_name:"我自己",
                    user_img:user_img,
                    digest: '今天是快乐的一天，我写完了作业，吃了好吃的，看了电影，喝了奶茶，还去了游乐场。',
                    emotion: '😀',
                    score: '⬤',
                },
            ],
            todo_data:[
                {
                    date: '2019.12.31 00:00',
                        content: '2019年最后一天',
                    expired: 0,
                    finished: 0,
                    id: 0,
                },
                {
                    date: '2019.12.31 00:00',
                        content: '2019年最后一天',
                    expired: 1,
                    finished: 0,
                    id: 1,
                },
                {
                    date: '2019.12.31 00:00',
                        content: '2019年最后一天',
                    expired: 2,
                    finished: 0,
                    id: 2,
                },
                {
                    date: '2019.12.31 00:00',
                        content: '2019年最后一天',
                    expired: 2,
                    finished: 1,
                    id: 3,
                },
            ],
        }
    }

    render() {
        const feed_items = this.state.feed_item_data.map((item, key)=>
            <FeedItem key={key}
                      date={item.date}
                      user_name={item.user_name}
                      user_img={item.user_img}
                      digest={item.digest}
                      emotion={item.emotion}
                      score={item.score}/>
        );

        return (
            <div>
                <header className="home-screen-header">
                    日记
                </header>

                <div className="home-screen-content">
                    <Row>
                        <Col sm={4} xs={6}>
                            <div className="home-screen-user-img-and-write-button">
                                <img src={this.state.user_img} alt="user_img"
                                     className="home-screen-user-img" width={225} height={225}/>
                                <Button variant="outline-success"
                                        className="home-screen-write-button">
                                    写日记
                                </Button>
                                <div className="home-screen-to-do-list">
                                    <ToDoList todo_data={this.state.todo_data}>
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

            </div>
        )
    }
}

export default Home;