import React from "react";

import Media from "react-bootstrap/Media";
import left_comma from "../../../data/img/quote-left-48.png";

import './FeedItem.css';

class FeedItem extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            date: props.date,
            type: props.type,
            item_id: props.item_id,
            dairy_id: props.diary_id,
            user_name: props.user_name,
            user_img: props.user_img,
            digest: props.digest,
            emotion: props.emotion,
            score: props.score,
        };
    }

    generateEmojis(){
        const emojis = this.state.emotion.map((item, index)=>(
            <div key={index} style={{zIndex: 0, position: "absolute",
                left: `${48-15*index}px`, top: "48px", fontSize: "24px", display: "inline"}}>
                {item}
            </div>
        ));
        return emojis;
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
                    <div className="feed-item-user-img-and-emotion-emotions">
                        {this.generateEmojis()}
                    </div>
                </div>
                <Media.Body className="feed-item-body">
                    <div className="feed-item-user-name-and-date">
                        {this.state.user_name}，{this.state.date}
                        <h5 className="feed-item-get-diary"></h5>
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