import React from "react";

import {FlexibleXYPlot, AreaSeries, XAxis, YAxis, Hint, GradientDefs, Crosshair} from 'react-vis';

import './PolarityEmotionChart.css';
import '../../../node_modules/react-vis/dist/style.css';

class PolarityEmotionChart extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            hintValue: null,
            currentIndex: null,
            crosshairValues: [],
            emojis: ["🤪", "🤪", "🤪", "🤪", "🤪", "🤪", "🤪"],
            digests: ["hi", "this", "is", "a", "cool", "diary", "app!"]
        };
    }

    render() {
        const DATA = [
            {x: 0, y: 0.89},
            {x: 1, y: 0.35},
            {x: 2, y: 0.11},
            {x: 3, y: 0.96},
            {x: 4, y: 0.55},
            {x: 5, y: 0.68},
            {x: 6, y: 0.55},
        ];

        const dates = ["12.1", "12.2", "12.3", "12.4", "12.5", "12.6", "12.7"];

        return (
            <div className="polarity-emotion-chart-box">
                <FlexibleXYPlot
                    colorType="linear"
                    onMouseLeave={() => this.setState({
                        hintValue: null, currentIndex: null, crosshairValues: []})}>
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
                                hintValue: DATA[index], currentIndex: index, crosshairValues: [DATA[index]]})}
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
                        className="invisible-crosshair-tag">
                        <p>{this.state.digests[this.state.currentIndex]}</p>
                    </Crosshair>

                </FlexibleXYPlot>
            </div>
        );
    }
}

export default PolarityEmotionChart;