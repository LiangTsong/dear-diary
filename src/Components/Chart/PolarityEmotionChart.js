import React from "react";

import {FlexibleXYPlot, AreaSeries, VerticalGridLines, HorizontalGridLines, XAxis, YAxis, Hint, GradientDefs} from 'react-vis';

import './PolarityEmotionChart.css';
import '../../../node_modules/react-vis/dist/style.css';

class PolarityEmotionChart extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            hintValue: null,
            currentIndex: null,
            emojis: ["🤪🦐🤪", "🌑", "🤪"],
        };
    }

    render() {
        const DATA = [
            {x: 1, y: 10},
            {x: 2, y: 7},
            {x: 3, y: 15},
        ];

        const animation = {damping: 10, stiffness: 300};

        return (
            <div className="polarity-emotion-chart-box">
                <FlexibleXYPlot
                    animation={animation}
                    onMouseLeave={() => this.setState({hintValue: null, currentIndex: null})}>
                    <VerticalGridLines />
                    <HorizontalGridLines />
                    <XAxis />
                    <YAxis />

                    <GradientDefs>
                        <linearGradient id="EmotionGradient" x1="0" x2="0" y1="0" y2="1">
                            <stop offset="0%" stopColor="red" stopOpacity={0.3}/>
                            <stop offset="20%" stopColor="yellow" stopOpacity={0.3}/>
                            <stop offset="50%" stopColor="blue" stopOpacity={0.3}/>
                            <stop offset="100%" stopColor="green" stopOpacity={0.3}/>
                        </linearGradient>
                    </GradientDefs>

                    <AreaSeries
                        color={'url(#EmotionGradient)'}
                        onNearestX={(value, {index}) =>
                            this.setState({hintValue: DATA[index], currentIndex: index})}
                        data={DATA}
                        curve="curveNatural"/>

                    {this.state.hintValue ?
                    (<Hint value={this.state.hintValue}>
                        <div className="polarity-emotion-chart-hint">
                            {this.state.emojis[this.state.currentIndex]}
                        </div>
                    </Hint>) : null}
                </FlexibleXYPlot>
            </div>
        );
    }
}

export default PolarityEmotionChart;