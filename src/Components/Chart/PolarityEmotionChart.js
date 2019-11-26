import React from "react";

import {FlexibleXYPlot, AreaSeries, XAxis, YAxis, Hint, GradientDefs, Crosshair} from 'react-vis';

import './PolarityEmotionChart.css';
import '../../../node_modules/react-vis/dist/style.css';

import Fade from "react-bootstrap/Fade";

import quote_left from "../../../data/img/quote-left-80.png";
import quote_right from "../../../data/img/quote-right-80.png";

class PolarityEmotionChart extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            hintValue: null,
            currentIndex: 0,
            crosshairValues: [],
            showDigest: false,
            emojis: ["🤪", "🤪", "🤪", "🤪", "🤪", "🤪", "🤪"],
            digests: ["开心开心开心开心开心开心开心", "伤心伤心伤心伤心伤心伤心伤心伤心",
                "伤心伤心伤心伤心伤心伤心伤心伤心伤心伤心伤心伤心伤心伤心伤心伤心伤心伤心伤心伤心伤心伤心伤心",
                "开心开心开心开心开心开心开心开心开心开心开心开心开心开心开心开心开心开心开心开心开心开心开心开心开心开心开心开心",
                "中等中等中等", "开心开心开心开心开心开心开心", "中等中等中等"],
            data: [
                {x: 0, y: 0.89},
                {x: 1, y: 0.35},
                {x: 2, y: 0.11},
                {x: 3, y: 0.96},
                {x: 4, y: 0.55},
                {x: 5, y: 0.68},
                {x: 6, y: 0.55},
            ]
        };
    }

    render() {
        const DATA = this.state.data;

        const dates = ["12.1", "12.2", "12.3", "12.4", "12.5", "12.6", "12.7"];

        return (
            <div>
                <div className="polarity-emotion-chart-box">
                    <FlexibleXYPlot
                        colorType="linear"
                        onMouseLeave={() => this.setState({
                            hintValue: null, crosshairValues: [], // currentIndex: null,
                            showDigest: false})}>
                        <XAxis
                            tickValues={[0, 1, 2, 3, 4, 5, 6]}
                            title="日期"
                            tickFormat={v => `${dates[v]}`}/>
                        <YAxis hideTicks/>

                        <GradientDefs>
                            <linearGradient id="EmotionGradient" x1="0" x2="0" y1="0" y2="1">
                                <stop offset="0%" stopColor="#FFD60A" stopOpacity={0.4}/>
                                <stop offset="55%" stopColor="#5AC8FA" stopOpacity={0.3}/>
                                <stop offset="65%" stopColor="#5AC8FA" stopOpacity={0.3}/>
                                <stop offset="100%" stopColor="#5856D6" stopOpacity={0.4}/>
                            </linearGradient>
                        </GradientDefs>

                        <AreaSeries
                            color={'url(#EmotionGradient)'}
                            onNearestX={(value, {index}) =>
                                this.setState({
                                    hintValue: DATA[index], currentIndex: index, crosshairValues: [DATA[index]],
                                    showDigest: true})}
                            data={DATA}
                            curve="curveCatmullRom"/>

                        {this.state.hintValue ?
                        (<Hint value={this.state.hintValue}>
                            <div className="polarity-emotion-chart-hint">
                                {this.state.emojis[this.state.currentIndex]}
                            </div>
                        </Hint>) : null}

                        <Crosshair
                            values={this.state.crosshairValues}
                            className="crosshair-tag">
                            <p>{DATA[this.state.currentIndex].y}</p>
                        </Crosshair>

                    </FlexibleXYPlot>
                </div>

                <Fade in={this.state.showDigest}>
                    <div className="polarity-emotion-chart-digest-box">
                        <img src={quote_left} width={25} height={25} alt="“"
                            className="polarity-emotion-chart-digest-box-quote-left"/>
                        {(DATA[this.state.currentIndex].y >= 0.5) ? (
                                <div className="polarity-emotion-chart-digest-up">
                                    {this.state.digests[this.state.currentIndex]}
                                </div>
                            ):(
                                <div className="polarity-emotion-chart-digest-down">
                                    {this.state.digests[this.state.currentIndex]}
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