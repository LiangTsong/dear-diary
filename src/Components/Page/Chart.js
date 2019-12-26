import React from "react";

import Button from "react-bootstrap/Button";
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';

import PolarityEmotionChart from "../Chart/PolarityEmotionChart";

import "./Chart.css"
import axios from "axios";
import {URL_ROOT, GET_CHART} from "../../Constants";
import Spinner from "react-bootstrap/Spinner";
import {Link} from "react-router-dom";

class Chart extends React.Component {
    constructor(props){
        super(props);
        this.state={
            data_show_number: 7,
            slider_value: 100,
            status: 0,
            id: [],
            data_number: 0,
            emojis: [],
            digests: [],
            data: [
            ],
            dates: [],
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
        console.log(response.data);

        if(response.data.success === 1){
            this.setState({
                id: response.data.id,
                data_number: response.data.data_number,
                emotions: response.data.emotions,
                digests: response.data.digests,
                data: response.data.data,
                dates: response.data.dates,
                status: 1,
            })
        }else{
            console.log("SUCCESS === 0");
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
                emotions: this.state.emotions.slice(begin, end),
                digests: this.state.digests.slice(begin, end),
                data: new_data,
                dates: this.state.dates.slice(begin, end),
                id: this.state.id.slice(begin, end),
                data_number: end - begin,
            };
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
                        <PolarityEmotionChart emotions={data_to_show.emotions}
                                              digests={data_to_show.digests}
                                              data={data_to_show.data}
                                              dates={data_to_show.dates}
                                              id={data_to_show.id}
                                              data_number={data_to_show.data_number}/>
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
                    <Link to={"/"}>
                        <Button className="chart-screen-header-home-link"
                                variant="outline-info">返回</Button>
                    </Link>
                </header>
                {this.generateBody()}
            </div>
        );
    }
}

export default Chart;