import React from "react";

import Media from "react-bootstrap/Media";
import user_img_generic from "../../../data/img/user_img_generic.jpeg";
import left_comma from "../../../data/img/quote-left-48.png";

import './FeedItem.css';

class FeedItem extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            date:'2019-12-31 00:00',
            user_name:'我自己',
            user_img:'../../../data/img/user_img_generic.jpeg',
            digest:'这是一段毫无意义的话这是一段毫无意义的话这是一段毫无意义的话这是一段毫无意义的话这是一段毫无意义的话',
            emotion:'😀',
            score:'⬤',
        };
    }

    render() {
        return(
            <Media>
                <div className="feed-item-user-img-and-emotion">
                    <img className="feed-item-user-img-and-emotion-img"
                        width={64}
                        height={64}
                        src={user_img_generic}
                        alt="Generic placeholder"
                    />
                    <h className="feed-item-user-img-and-emotion-emotion">
                        {this.state.emotion}
                    </h>
                </div>
                <Media.Body>
                    <div>
                        {this.state.user_name}，{this.state.date}
                        <h5 className="feed-item-score">{this.state.score}</h5>
                    </div>
                    <img src={left_comma} alt='“'/>
                    <p className="feed-item-digest">
                        {this.state.digest}
                    </p>
                </Media.Body>
            </Media>
        )
    }
}

export default FeedItem;