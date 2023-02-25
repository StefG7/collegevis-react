import React, {useEffect} from 'react';
import p5 from 'p5';
import './Detail.css'

import {MAJOR_CATEGORIES, MAJOR_COLORS, MAJOR_POSITIONS, MINOR_CATEGORIES} from '../constants.jsx';

let landingPageState = 0; // 0: Major Planet in focus, 1: Minor Planet selection, 2: Minor Planet information
let majorPlanetInFocus = -1; // id of the major planet clicked on

let numPlanet = MAJOR_CATEGORIES.length;
let planetSizeRatio = 0.15;
let majorPlanetList = [];
let textSize = 16; // Planet text size

let majorMinorRatio = 0.2; // size ratio between major and minor planets
let minorFocusRatio = 0.8; // size ratio between major and minor planets when the minor planets are in focus
let minorDistRatio = 0.05; // the margin given between each in-focus minor planets
let minorOrbitHeightRatio = 0.15; // how far from the major planet is the minor planet orbiting

let borderMarginRatio = 0.05; // when in state 1, the ratio (to window size) of the margin from the border
							 // Bigger the number, the closer to the center the planets are in state 2

let textPlanetMarginRatio = 0.2; // The margin size between major planet in focus and the text description, in format of ratio to planet diameter

// Somewhat hacky solution to communicate hovering between p5 minor planets and HTML
let hoveringMinor = false;
let previousHM = hoveringMinor; // this is necessary because we don't want to setState when we don't need to
let hoveringPlanetName = "";

function projectPosition(p0, p1, left, right, top, bottom) {	
	// Figure out planet position after putting a major planet in focus
	// Cast a ray from p0 to p1, given four bounds, return intersection pt of the ray & the bounds
	// p0 & p1: [x, y]; left & right & top & bottom: number; p: [x,y]
	let slope = (p1[1] - p0[1]) / (p1[0] - p0[0]);
	let intercept = p0[1] - p0[0] * slope;

	let pp0 = p0[0] > p1[0] ? [left, left * slope + intercept] : [right, right * slope + intercept];
	let pp1 = p0[1] > p1[1] ? [(top - intercept) / slope, top] : [(bottom - intercept) / slope, bottom];

	if (pp0[1] >= top && pp0[1] <= bottom) return pp0;
	else return pp1;
}

class FirstPage extends React.Component {
	constructor(props) {
		super(props);
		this.myRef = React.createRef();
		this.canvasCreated = false;
		this.state = {"textX": 0, "textY": 0,
					"descriptionText": "Yeah", "textOpacity": 0};
	}
	
	Sketch = (p5) => {

		p5.setup = () => {
			p5.createCanvas(p5.windowWidth, p5.windowHeight);

			for (let i = 0; i < numPlanet; i++) {
				majorPlanetList[i] = new MajorPlanet(
					p5.width * MAJOR_POSITIONS[MAJOR_CATEGORIES[i]][0],
					p5.height * MAJOR_POSITIONS[MAJOR_CATEGORIES[i]][1],
					p5.min(p5.windowWidth, p5.windowHeight) * planetSizeRatio,
					i,
					MAJOR_CATEGORIES[i],
					majorPlanetList,
					p5
				);

			}
			p5.noStroke();
		}
   
		p5.draw = () => {
			// p5.background(0);

			majorPlanetList.forEach(planet => {
				planet.display();
			});
		}

		this.updatePlanetPosition = () => {
			if (landingPageState == 0) {
				for (let i = 0; i < majorPlanetList.length; i++){
					majorPlanetList[i].x = p5.width * MAJOR_POSITIONS[MAJOR_CATEGORIES[i]][0];
					majorPlanetList[i].y = p5.height * MAJOR_POSITIONS[MAJOR_CATEGORIES[i]][1];
					majorPlanetList[i].diameter = p5.min(p5.windowWidth, p5.windowHeight) * planetSizeRatio;
					majorPlanetList[i].updateMinorPlanetPosition();
				}
			}
			else if (landingPageState == 1) {
				let p0 = [p5.width * MAJOR_POSITIONS[MAJOR_CATEGORIES[majorPlanetInFocus]][0],
						  p5.height * MAJOR_POSITIONS[MAJOR_CATEGORIES[majorPlanetInFocus]][1]];
				let left = 0 + p5.width * borderMarginRatio;
				let right = p5.width - p5.width * borderMarginRatio;
				let top = 0 + p5.height * borderMarginRatio;
				let bottom = p5.height - p5.height * borderMarginRatio;
				
				for (let i = 0; i < majorPlanetList.length; i++) {
					let p1 = [p5.width * MAJOR_POSITIONS[MAJOR_CATEGORIES[i]][0],
							p5.height * MAJOR_POSITIONS[MAJOR_CATEGORIES[i]][1]];

					if (i != majorPlanetInFocus) {
						[majorPlanetList[i].x, majorPlanetList[i].y] = projectPosition(p0, p1,
																		left, right, top, bottom);
						majorPlanetList[i].diameter = p5.min(p5.windowWidth, p5.windowHeight) * planetSizeRatio / 4;
					}
					else {
						majorPlanetList[i].x = p5.width / 5;
						majorPlanetList[i].y = p5.height / 3;
						majorPlanetList[i].diameter = p5.min(p5.windowWidth, p5.windowHeight) * planetSizeRatio * 2; // SAME AS THE ONE IN RENDER FUNCTION
						this.setState({	 "textX": majorPlanetList[i].x + majorPlanetList[i].diameter / 2 + majorPlanetList[i].diameter * textPlanetMarginRatio,
										 "textY": majorPlanetList[i].y - majorPlanetList[i].diameter / 2});
					}
					majorPlanetList[i].updateMinorPlanetPosition();
				}
			}
		}

		p5.windowResized = () => {
			p5.resizeCanvas(p5.windowWidth, p5.windowHeight);
			this.updatePlanetPosition();
		}

		p5.mouseClicked = () => {
			if (landingPageState == 0){
				for (let i = 0; i < majorPlanetList.length; i++) {
					if (p5.pow(p5.mouseX - majorPlanetList[i].x, 2) + 
						p5.pow(p5.mouseY - majorPlanetList[i].y, 2) < 
							p5.pow(majorPlanetList[i].diameter / 2, 2)) {
						majorPlanetInFocus = i;
						landingPageState = 1;
					}
				}

				this.updatePlanetPosition();
			}
			else if (landingPageState == 1){
				landingPageState = 0;
				
				this.updatePlanetPosition();
			}
		}
	}

	printSomething() {
		console.log('hello!');
		this.setState({"descriptionText": "hello", "textOpacity": 1});
	}

	componentDidMount() {
		if (!this.canvasCreated){
			this.myP5 = new p5(this.Sketch, this.myRef.current);
			this.canvasCreated = true;
		}
	}

	render() {
		console.log([hoveringMinor, previousHM]);
		if (previousHM != hoveringMinor){
			this.setState({
				"descriptionText": hoveringPlanetName,
				"textOpacity": hoveringMinor ? 1 : 0});
			previousHM = hoveringMinor;
		}

		return (	
			<div id="FirstPageContainer">
				<p id="MinorDescription" style={{
												left: `${this.state.textX}px`,
												top: `${this.state.textY}px`,
												opacity: `${this.state.textOpacity}`}}>
						{this.state.descriptionText}</p>
				<div ref={this.myRef} className="p5Container"></div>
			</div>
			);
	}
}

class MajorPlanet {
	constructor(xin, yin, din, idin, nin, oin, p5) {
		this.x = xin;
		this.y = yin;
		this.diameter = din;
		this.id = idin;
		this.name = nin;
		this.others = oin;
		this.p5 = p5;

		this.minorList = [];
		for (let i = 0; i < MINOR_CATEGORIES[this.name].length; i++) {
			this.minorList[i] = new MinorPlanet(
				xin,
				yin,
				din,
				this.id,
				i,
				MINOR_CATEGORIES[this.name][i],
				this.minorList,
				p5
			);
		}
	}

	updateMinorPlanetPosition() {
		for (let i = 0; i < this.minorList.length; i++) {
			this.minorList[i].majorX = this.x;
			this.minorList[i].majorY = this.y;
			this.minorList[i].majorD = this.diameter;
			this.minorList[i].r = this.diameter / 2 + this.diameter * minorOrbitHeightRatio;
			this.minorList[i].setPosition();
		}
	}

	display(){
		if (landingPageState == 0){

			// Display Major Planet Text
			this.p5.fill(MAJOR_COLORS[MAJOR_CATEGORIES[this.id]]);
			this.p5.textSize(textSize);
			this.p5.textAlign(this.p5.CENTER);
			this.p5.text(this.name, this.x, this.y + this.diameter / 2 + textSize);

			// Hover checking
			if (this.p5.pow(this.p5.mouseX - this.x, 2) + 
				this.p5.pow(this.p5.mouseY - this.y, 2) < 
					this.p5.pow(this.diameter / 2, 2)) {
				this.p5.fill("#ffffff");
			}
			else {
				this.p5.fill(MAJOR_COLORS[MAJOR_CATEGORIES[this.id]]);
			}
		}
		else this.p5.fill(MAJOR_COLORS[MAJOR_CATEGORIES[this.id]]);

		this.p5.ellipse(this.x, this.y, this.diameter, this.diameter);

		for (let i = 0; i < this.minorList.length; i++) {
			this.minorList[i].display();
		}
	}
}

class MinorPlanet {
	constructor(xin, yin, din, midin, idin, nin, oin, p5) {
		this.majorX = xin;
		this.majorY = yin;
		this.majorD = din;
		this.majorI = midin;
		this.id = idin;
		this.name = nin;
		this.others = oin;
		this.p5 = p5;

		this.r = this.majorD / 2 + this.majorD * minorOrbitHeightRatio;
		this.angle = this.id * this.p5.PI / 4;
		this.setPosition();
	}

	setPosition(){
		let x = 0;
		let y = 0;
		let d = this.majorD * majorMinorRatio;
		let m = this.majorD * minorDistRatio;
		if (landingPageState == 1 && this.majorI == majorPlanetInFocus){
			d = this.majorD * minorFocusRatio;

			// Constrain d by screen width
			let d_width = this.p5.width * (1 - borderMarginRatio * 2) / this.others.length;
			d = d > d_width ? d_width : d;

			x = this.p5.width / 2 + (this.others.length - 1) * (-0.5 * d - 0.5 * m) + this.id * (d + m); // left-most position + id * increments
			y = this.p5.height * 2 / 3;
		}
		else {
			x = this.majorX + this.r * this.p5.cos(this.angle);
			y = this.majorY - this.r * this.p5.sin(this.angle);
		}
		this.x = x;
		this.y = y;
		this.d = d;
	}

	display(){
		if (landingPageState == 1){

			// Hover checking
			hoveringMinor = false;
			if (this.p5.pow(this.p5.mouseX - this.x, 2) + 
				this.p5.pow(this.p5.mouseY - this.y, 2) < 
					this.p5.pow(this.d / 2, 2)) {
				this.p5.fill("#ffffff");
				hoveringMinor = true;
				hoveringPlanetName = this.name;
			}
			else {
				this.p5.fill(MAJOR_COLORS[MAJOR_CATEGORIES[this.majorI]]);
			}

			// TODO: SET HOVERING MINOR TO FALSE WHEN NO PLANET GETS HOVERED OVER
		}
		else this.p5.fill(MAJOR_COLORS[MAJOR_CATEGORIES[this.majorI]]);

		this.p5.ellipse(this.x, this.y, this.d, this.d);

		if (landingPageState == 1 && this.majorI == majorPlanetInFocus){
			
			// Display Minor Planet Text
			this.p5.fill("#ffffff");
			this.p5.textSize(textSize);
			this.p5.textAlign(this.p5.CENTER);
			this.p5.text(this.name, this.x, this.y + this.d / 4);

		}
	}
}

export default FirstPage;