// using example from LogRocket to set up React + D3 development env.
// URL: https://blog.logrocket.com/getting-started-d3-js-react/
// need to do a bit more digging regarding how React integrates components

import React, { Component } from 'react'
// eslint-disable-next-line
import * as d3 from 'd3'

function returnText (d) {
    return <p>{d}</p>;
}

class BarChart extends Component {
    componentDidMount() {
        this.drawChart();
    }

    drawChart() {
        console.log(this.props.data)

        const data = this.props.data;

        const svg = d3.select("body").append("svg")
            .attr("width", this.props.width)
            .attr("height", this.props.height);

        svg.selectAll("rect")
            .data(data)
            .enter()
            .append("rect")
            .attr("x", (d, i) => i * 70)
            .attr("y", (d, i) => 300 - 10 * d)
            .attr("width", 65)
            .attr("height", (d, i) => d * 10)
            .attr("fill", "green");


        svg.selectAll("text")
            .data(data)
            .enter()
            .append("text")
            .text((d) => d)
            .attr("x", (d, i) => i * 70)
            .attr("y", (d, i) => 300 - (10 * d) - 3)
    }

    render() {
        let d = this.props.data;
        // return <div id={"#" + this.props.id}></div>
        return (
            <div>
                {d.map(returnText)}
            </div>
        )
    }
}

export default BarChart;