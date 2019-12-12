import React from "react";

import {FlexibleXYPlot, AreaSeries, XAxis, YAxis, Hint, GradientDefs, Crosshair} from 'react-vis';

import './PolarityEmotionChart.css';
import '../../../node_modules/react-vis/dist/style.css';

import Fade from "react-bootstrap/Fade";

import quote_left from "../../../data/img/quote-left-80.png";
import quote_right from "../../../data/img/quote-right-80.png";
import moment from "moment";

class PolarityEmotionChart extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            hintValue: null,
            currentIndex: 0,
            crosshairValues: [],
            showDigest: false,
        };
    }

    getHighest(){
        let i;
        let highest = 0;
        for(i=0; i<this.props.dates.length; i++){
            if(this.props.data[i].y > highest){
                highest = this.props.data[i].y;
            }
        }
        return (100-highest*100)+"%";
    }

    tickFormat(value, index, scale, tickTotal){
        if(index === 0){
            return(moment.unix((new Date(this.props.dates[0])).getTime()/1000)
                .format("MM/DD"));
        }else{
            return(moment.unix((new Date(this.props.dates[this.props.dates.length-1])).getTime()/1000)
                .format("MM/DD"));
        }
    }

    render() {

        return (
            <div>
                <div className="polarity-emotion-chart-box">
                    <FlexibleXYPlot
                        yDomain={[0, 1]}
                        colorType="linear"
                        onMouseLeave={() => this.setState({
                            hintValue: null, crosshairValues: [], // currentIndex: null,
                            showDigest: false})}>
                        <XAxis
                            title="日期"
                            tickValues={[0, this.props.data.length-1]}
                            tickLabelAngle={30}
                            tickPadding={20}
                            tickFormat={(v, i, s, t)=>this.tickFormat(v, i, s, t)}/>
                        <YAxis hideTicks/>

                        <GradientDefs>
                            <linearGradient id="EmotionGradient" x1="0" x2="0" y1="0" y2="1">
                                {/*<stop offset="0%" stopColor="#FFD60A" stopOpacity={0.4}/>*/}
                                {/*<stop offset={this.getHighest()} stopColor="#FFD60A" stopOpacity={0.4}/>*/}
                                <stop offset="0%" stopColor="#5AC8FA" stopOpacity={0.3}/>
                                <stop offset="100%" stopColor="#5AC8FA" stopOpacity={0.3}/>
                                <stop offset="100%" stopColor="#5856D6" stopOpacity={0.4}/>
                            </linearGradient>
                        </GradientDefs>

                        <AreaSeries
                            color={'url(#EmotionGradient)'}
                            onNearestX={(value, {index}) =>
                                this.setState({
                                    hintValue: this.props.data[index], currentIndex: index, crosshairValues: [this.props.data[index]],
                                    showDigest: true})}
                            data={this.props.data}
                            curve="curveCatmullRom"/>

                        {this.state.hintValue ?
                        (<Hint value={this.state.hintValue}>
                            <div className="polarity-emotion-chart-hint">
                                {this.props.emojis[this.state.currentIndex]}
                            </div>
                        </Hint>) : null}

                        <Crosshair
                            values={this.state.crosshairValues}
                            className="crosshair-tag">
                            <p>{this.props.data[this.state.currentIndex].y}</p>
                            <p>{moment.unix((new Date(this.props.dates[this.state.currentIndex]))
                                .getTime()/1000)
                                .format("YYYY年MM月DD日")}</p>
                        </Crosshair>

                    </FlexibleXYPlot>
                </div>

                <Fade in={this.state.showDigest}>
                    <div className="polarity-emotion-chart-digest-box">
                        <img src={quote_left} width={25} height={25} alt="“"
                            className="polarity-emotion-chart-digest-box-quote-left"/>
                        {(this.props.data[this.state.currentIndex].y >= 0.5) ? (
                                <div className="polarity-emotion-chart-digest-up">
                                    {this.props.digests[this.state.currentIndex]}
                                </div>
                            ):(
                                <div className="polarity-emotion-chart-digest-down">
                                    {this.props.digests[this.state.currentIndex]}
                                </div>
                            )
                        }
                        <img src={quote_right} width={25} height={25} alt="”"
                            className="polarity-emotion-chart-digest-box-quote-right"/>
                    </div>
                </Fade>
            </div>
        );
    }
}

export default PolarityEmotionChart;