import React from "react";

import Button from "react-bootstrap/Button";
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';

import PolarityEmotionChart from "../Chart/PolarityEmotionChart";

import "./Chart.css"
import axios from "axios";
import {URL_ROOT, GET_CHART} from "../../Constants";
import Spinner from "react-bootstrap/Spinner";

class Chart extends React.Component {
    constructor(props){
        super(props);
        this.state={
            data_show_number: 7,
            slider_value: 100,
            status: 0,
            id: [],
            data_number: 11,
            emojis: [["🤪"], ["🤪"], ["😭"], ["🤪"], ["🤪"], ["🤪"], ["🤪"], ["🤪"], ["🤪"], ["🤪"], [""]],
            digests: ["开心开心开心开心开心开心开心", "伤心伤心伤心伤心伤心伤心伤心伤心",
                "难过到了极点。早课睡过头了。外卖撒了。ddl到了。火车晚点了。真是伤心的一天。",
                "今天是快乐的一天，我写完了作业，吃了好吃的，看了电影，喝了奶茶，还去了游乐场。",
                "中等中等中等", "开心开心开心开心开心开心开心", "中等中等中等", "中等中等中等",
                "中等中等中等", "中等中等中等", "中等中等中等", "中等中等中等"],
            data: [
                {x: 0, y: 0.89},
                {x: 1, y: 0.35},
                {x: 2, y: 0.11},
                {x: 3, y: 0.93},
                {x: 4, y: 0.55},
                {x: 5, y: 0.68},
                {x: 6, y: 0.55},
                {x: 7, y: 0.56},
                {x: 8, y: 0.57},
                {x: 9, y: 0.58},
                {x: 10, y: 0.59},
            ],
            dates: [new Date().getTime(), "12.2", "12.3", "12.4", "12.5", "12.6", "12.7", "12.8", "12.9", "12.10", new Date().getTime()],
        }
    }

    async componentDidMount() {
        this.setState({
           status: 0,
        });

        const post_data = {};

        const response = await axios.post(
            URL_ROOT + GET_CHART,
            post_data
        );

        if(response.success === 1){
            this.setState({
                id: response.id,
                data_number: response.data_number,
                emotions: response.emotions,
                digests: response.digests,
                data: response.data,
                dates: response.dates,
                status: 1,
            })
        }

    }

    generateDataToShow(){
        let step;
        let data_to_show;
        if(this.state.data_number > this.state.data_show_number){
            const diff = this.state.data_number - this.state.data_show_number;
            step = diff/100.0;
            // console.log(step);
            const end = Math.floor(this.state.data_number - diff + this.state.slider_value * step);
            // console.log(end);
            const begin = end - this.state.data_show_number;
            // console.log(begin);

            const data = this.state.data.slice(begin, end);
            const new_data = data.map((item, index)=>(
                {
                    x: index,
                    y: item.y,
                }
            ));
            data_to_show = {
                emojis: this.state.emojis.slice(begin, end),
                digests: this.state.digests.slice(begin, end),
                data: new_data,
                dates: this.state.dates.slice(begin, end),
                id: this.state.id.slice(begin, end)
            };
            // console.log(data_to_show);
            return data_to_show;
        }else{
            return this.state;
        }
    }

    handleSliderChange(value){
        this.setState({
            slider_value: value,
        });
    }

    handleButton(days){
        this.setState({
            data_show_number: days,
        });
    }

    generateBody(){
        const data_to_show = this.generateDataToShow();
        if(this.state.status === 0){
            return(
                <Spinner className="chart-page-spinner" animation="grow" />
            );
        }else if(this.state.status === 1){
            return(
                <div>
                    <div className="chart-screen-week-month-year-buttons">
                        <Button variant="outline-primary" className="chart-screen-button" onClick={()=>this.handleButton(7)}>周</Button>
                        <Button variant="outline-primary" className="chart-screen-button" onClick={()=>this.handleButton(30)}>月</Button>
                        <Button variant="outline-primary" className="chart-screen-button" onClick={()=>this.handleButton(365)}>年</Button>
                    </div>
                    <div className="chart-screen-horizontal-slider">
                        <Slider value={this.state.slider_value} onChange={(value)=>this.handleSliderChange(value)}/>
                    </div>
                    <div className="chart-screen-chart">
                        <PolarityEmotionChart emojis={data_to_show.emojis}
                                              digests={data_to_show.digests}
                                              data={data_to_show.data}
                                              dates={data_to_show.dates}
                                              id={data_to_show.id}/>
                    </div>
                </div>
            );
        }
    }

    render() {

        return(
            <div>
                <header className="chart-screen-header">
                    回顾
                </header>
                {this.generateBody()}
            </div>
        );
    }
}

export default Chart;