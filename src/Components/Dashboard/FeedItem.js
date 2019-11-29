import React from "react";

import Media from "react-bootstrap/Media";
import left_comma from "../../../data/img/quote-left-48.png";

import './FeedItem.css';

class FeedItem extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            date: props.date,
            user_name: props.user_name,
            user_img: props.user_img,
            digest: props.digest,
            emotion: props.emotion,
            score: props.score,
        };
    }

    render() {
        return(
            <Media className="feed-item">
                <div className="feed-item-user-img-and-emotion">
                    <img className="feed-item-user-img-and-emotion-img"
                        width={64}
                        height={64}
                        src={this.state.user_img}
                        alt="Generic placeholder"
                    />
                    <div className="feed-item-user-img-and-emotion-emotion">
                        {this.state.emotion}
                    </div>
                </div>
                <Media.Body className="feed-item-body">
                    <div className="feed-item-user-name-and-date">
                        {this.state.user_name}，{this.state.date}
                        <h5 className="feed-item-score">{this.state.score}</h5>
                    </div>
                    <img src={left_comma} width={24} height={24} alt='“'/>
                    <p className="feed-item-digest">
                        {this.state.digest}
                    </p>
                </Media.Body>
            </Media>
        )
    }
}

export default FeedItem;