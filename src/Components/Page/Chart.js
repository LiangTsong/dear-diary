import React from "react";

import Button from "react-bootstrap/Button";
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';

import PolarityEmotionChart from "../Chart/PolarityEmotionChart";

import "./Chart.css"

class Chart extends React.Component {
    constructor(props){
        super(props);
        this.state={
            slider_value: 0,
            data_number: 7,
            emojis: ["🤪", "🤪", "😭", "🤪", "🤪", "🤪", "🤪"],
            digests: ["开心开心开心开心开心开心开心", "伤心伤心伤心伤心伤心伤心伤心伤心",
                "难过到了极点。早课睡过头了。外卖撒了。ddl到了。火车晚点了。真是伤心的一天。",
                "今天是快乐的一天，我写完了作业，吃了好吃的，看了电影，喝了奶茶，还去了游乐场。",
                "中等中等中等", "开心开心开心开心开心开心开心", "中等中等中等"],
            data: [
                {x: 0, y: 0.89},
                {x: 1, y: 0.35},
                {x: 2, y: 0.11},
                {x: 3, y: 0.93},
                {x: 4, y: 0.55},
                {x: 5, y: 0.68},
                {x: 6, y: 0.55},
            ],
            dates: ["12.1", "12.2", "12.3", "12.4", "12.5", "12.6", "12.7"],
        }
    }

    handleSliderChange(value){
        this.setState({
           slider_value: value,
        });
    }

    handleButton(days){
        this.setState({
            data_number: days,
        });
    }

    render() {



        return(
            <div>
                <header className="chart-screen-header">
                    回顾
                </header>
                <div className="chart-screen-week-month-year-buttons">
                    <Button variant="outline-primary" className="chart-screen-button" onClick={()=>this.handleButton(7)}>周</Button>
                    <Button variant="outline-primary" className="chart-screen-button" onClick={()=>this.handleButton(30)}>月</Button>
                    <Button variant="outline-primary" className="chart-screen-button" onClick={()=>this.handleButton(365)}>年</Button>
                </div>
                <div className="chart-screen-horizontal-slider">
                    <Slider value={this.state.slider_value} onChange={(value)=>this.handleSliderChange(value)}/>
                </div>
                <div className="chart-screen-chart">
                    <PolarityEmotionChart emojis={this.state.emojis}
                                          digests={this.state.digests}
                                          data={this.state.data}
                                          dates={this.state.dates}/>
                </div>
            </div>
        );
    }
}

export default Chart;