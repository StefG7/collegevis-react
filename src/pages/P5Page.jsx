import React, {useEffect} from 'react';
import p5 from 'p5';

import 'bootstrap/dist/css/bootstrap.min.css';
import '../App.css'

import MinorTags from '../components/MinorTags';

import {PAGE_STATE, MAJOR_CATEGORIES, MAJOR_COLORS, MAJOR_POSITIONS, MINOR_CATEGORIES} from '../constants.jsx';
import {MINOR_DESCRIPTION_FIRST_PAGE} from '../data/minor_descriptions.jsx';

let numPlanet = MAJOR_CATEGORIES.length;
let planetSizeRatio = 0.15;
let majorPlanetList = [];
let textSize = 16; // Planet text size

let majorMinorRatio = 0.2; // size ratio between major and minor planets
let minorFocusRatio = 0.8; // size ratio between major and minor planets when the minor planets are in focus
let minorDistRatio = 0.05; // the margin given between each in-focus minor planets
let minorOrbitHeightRatio = 0.15; // how far from the major planet is the minor planet orbiting

let selectionStrokeRatio = 0.04; // the margin of highlight from circle, also determines the stroke weight
let textBoxRatio = 0.4; // The size of the text box as an ratio to the diameter of the circle

let borderMarginRatio = 0.05; // when in state 1, the ratio (to window size) of the margin from the border
							 // Bigger the number, the closer to the center the planets are in state 2

let textPlanetMarginRatio = 0.2; // The margin size between major planet in focus and the text description, in format of ratio to planet diameter

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

class P5Page extends React.Component {
	constructor(props) {
		super(props);
		this.myRef = React.createRef();
		this.canvasCreated = false;
		this.state = {"textX": 0, "textY": 0,
					"hoverMinorPlanetName": "Yeah", "textOpacity": 0,
					"forceUpdate": true}; // Toggle this state var to force rerender

		// Page Navigation related variables
		this.landingPageState = 0; // 0: Major Planet in focus, 1: Minor Planet selection, 2: Minor Planet information
		this.majorPlanetInFocus = -1; // id of the major planet clicked on
		this.hoveringMinor = false;
		this.previousHM = this.hoveringMinor; // this is necessary because we don't want to setState when we don't need to
		this.hoverMinorPlanetName = '';
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
			p5.background(24, 29, 39);

			// Planet Rendering when in Home Page
			if (this.props.pageState == PAGE_STATE["Home"]){
				// SETTING HOVERMINOR TO FALSE EVERY FRAME
				// The minor planet being hovered over will set this to true
				this.hoveringMinor = false;
				let minorPlanetString = '';

				majorPlanetList.forEach(planet => {
					minorPlanetString = planet.display(this.landingPageState, this.majorPlanetInFocus, this.props.minorSelections);
					if (minorPlanetString){ 
						this.hoveringMinor = true;
						this.hoverMinorPlanetName = minorPlanetString;
					}
				});


				// Checking whether hovering over minor planet is true and set text opacity
				if (this.landingPageState == 1) {
					if (this.previousHM != this.hoveringMinor){
						this.setState({"textOpacity": this.hoveringMinor ? 1 : 0});
						this.previousHM = this.hoveringMinor;
					}
					
					// This is separate because just in case the user moves mouse too fast to update hoveringMinor
					if (this.hoverMinorPlanetName != this.state.hoverMinorPlanetName){
						this.setState({
							"hoverMinorPlanetName": this.hoverMinorPlanetName});
					}
				}
			}

		}

		this.updatePlanetPosition = () => {
			if (this.landingPageState == 0) {
				for (let i = 0; i < majorPlanetList.length; i++){
					majorPlanetList[i].x = p5.width * MAJOR_POSITIONS[MAJOR_CATEGORIES[i]][0];
					majorPlanetList[i].y = p5.height * MAJOR_POSITIONS[MAJOR_CATEGORIES[i]][1];
					majorPlanetList[i].diameter = p5.min(p5.windowWidth, p5.windowHeight) * planetSizeRatio;
					majorPlanetList[i].updateMinorPlanetPosition(this.landingPageState, this.majorPlanetInFocus);
				}
			}
			else if (this.landingPageState == 1) {
				let p0 = [p5.width * MAJOR_POSITIONS[MAJOR_CATEGORIES[this.majorPlanetInFocus]][0],
						  p5.height * MAJOR_POSITIONS[MAJOR_CATEGORIES[this.majorPlanetInFocus]][1]];
				let left = 0 + p5.width * borderMarginRatio;
				let right = p5.width - p5.width * borderMarginRatio;
				let top = 0 + p5.height * borderMarginRatio;
				let bottom = p5.height - p5.height * borderMarginRatio;
				
				for (let i = 0; i < majorPlanetList.length; i++) {
					let p1 = [p5.width * MAJOR_POSITIONS[MAJOR_CATEGORIES[i]][0],
							p5.height * MAJOR_POSITIONS[MAJOR_CATEGORIES[i]][1]];

					if (i != this.majorPlanetInFocus) {
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
					majorPlanetList[i].updateMinorPlanetPosition(this.landingPageState, this.majorPlanetInFocus);
				}
			}
		}

		p5.windowResized = () => {
			p5.resizeCanvas(p5.windowWidth, p5.windowHeight);
			this.updatePlanetPosition(this.landingPageState, this.majorPlanetInFocus);
		}

		p5.mouseClicked = () => {
			
			// Click Event Handling when in Home Page
			if (this.props.pageState == PAGE_STATE["Home"]){
				if (this.landingPageState == 0){
					for (let i = 0; i < majorPlanetList.length; i++) {
						if (p5.pow(p5.mouseX - majorPlanetList[i].x, 2) + 
							p5.pow(p5.mouseY - majorPlanetList[i].y, 2) < 
								p5.pow(majorPlanetList[i].diameter / 2, 2)) {
							this.majorPlanetInFocus = i;
							this.landingPageState = 1;
						}
					}

					this.updatePlanetPosition();
				}
				else if (this.landingPageState == 1){
					let clickedOnMinorPlanet = false;

					// Toggling the minor selections
					let minorSelections = this.props.minorSelections;
					let minorList = majorPlanetList[this.majorPlanetInFocus].minorList;

					for (let i = 0; i < minorList.length; i++) {
						if (p5.pow(p5.mouseX - minorList[i].x, 2) + 
							p5.pow(p5.mouseY - minorList[i].y, 2) < 
								p5.pow(minorList[i].d / 2, 2)) {
							
							let index = minorSelections.indexOf(minorList[i].name);
							if (index > -1) minorSelections.splice(index, 1);
							else minorSelections.push(minorList[i].name);

							clickedOnMinorPlanet = true;
							break
						}
					}

					this.props.setMinorSelections(minorSelections);
					this.setState({"forceUpdate": !this.state.forceUpdate}); // set this state to force re-render

					if (!clickedOnMinorPlanet) {
						this.setState({"textOpacity": 0});
						this.landingPageState = 0;
						this.updatePlanetPosition();
					}
				}
			}
			else {
				// when not in home page
				this.setState({"textOpacity": 0});
				this.updatePlanetPosition(this.landingPageState, this.majorPlanetInFocus);
			}
		}
	}

	componentDidMount() {
		if (!this.canvasCreated){
			this.myP5 = new p5(this.Sketch, this.myRef.current);
			this.canvasCreated = true;
		}
	}

	render() {
		return (	
			<div id="FirstPageContainer">
				<div className='row'>
					<div className='btn-layout col-sm-12' style={{display: 'flex',justifyContent:'flex-end'}}>
						{ // For Home Page when minorSelection has content in it
						this.props.pageState == PAGE_STATE["Home"] && this.props.minorSelections.length != 0 &&
							<div>
								<button className='btn mx-3' onClick={() => this.props.setState(PAGE_STATE["Majors"])}>Explore Majors</button>
								<button className='btn mx-3' onClick={() => this.props.setState(PAGE_STATE["Careers"])}>Explore Careers</button>
							</div>
						}
					</div>
				</div>
				<MinorDescription		style={{
											left: `${this.state.textX}px`,
											top: `${this.state.textY}px`,
											width: `60%`,
											opacity: `${this.state.textOpacity}`
										}}
										planetName={this.state.hoverMinorPlanetName}>
				</MinorDescription>
				<div ref={this.myRef} className="p5Container"></div>
				<MinorTags
					minorSelections={this.props.minorSelections}
					setMinorSelections={this.props.setMinorSelections}
				></MinorTags>
			</div>
			);
	}
}


const MinorDescription = (props) => {
    return (
        <div id="MinorDescription" style={props.style}>
			<h1> {props.planetName} </h1>
            <p> {MINOR_DESCRIPTION_FIRST_PAGE[props.planetName]} </p>
        </div>
    );
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

	updateMinorPlanetPosition(landingPageState, majorPlanetInFocus) {
		for (let i = 0; i < this.minorList.length; i++) {
			this.minorList[i].majorX = this.x;
			this.minorList[i].majorY = this.y;
			this.minorList[i].majorD = this.diameter;
			this.minorList[i].r = this.diameter / 2 + this.diameter * minorOrbitHeightRatio;
			this.minorList[i].setPosition(landingPageState, majorPlanetInFocus);
		}
	}

	// The return is to account for passing which minor planet is being hovered over
	display(landingPageState, majorPlanetInFocus, minorSelections){
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

		// Return name of the minor planet when being hovered over and in focus, empty string otherwise
		let minorPlanetString = '';

		for (let i = 0; i < this.minorList.length; i++) {
			let minorName = this.minorList[i].display(landingPageState, majorPlanetInFocus, minorSelections);

			if (minorName != '') minorPlanetString = minorName;
		}

		return minorPlanetString;
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
		this.angle = this.id * this.p5.PI / 5;
		this.setPosition();
	}

	setPosition(landingPageState, majorPlanetInFocus){
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

	// The return is to account for passing which minor planet is being hovered over
	display(landingPageState, majorPlanetInFocus, minorSelections){

		// Return name of the minor planet when being hovered over and in focus, empty string otherwise
		let minorPlanetString = '';

		if (landingPageState == 1){

			// Hover checking
			if (this.p5.pow(this.p5.mouseX - this.x, 2) + 
				this.p5.pow(this.p5.mouseY - this.y, 2) < 
					this.p5.pow(this.d / 2, 2)) {
				this.p5.fill("#ffffff");
				minorPlanetString = this.name;
			}
			else {
				this.p5.fill(MAJOR_COLORS[MAJOR_CATEGORIES[this.majorI]]);
			}
		}
		else this.p5.fill(MAJOR_COLORS[MAJOR_CATEGORIES[this.majorI]]);

		this.p5.ellipse(this.x, this.y, this.d, this.d);

		// Drawing highlight ring when the minor planet is selected
		if (minorSelections.indexOf(this.name) > -1) {
			this.p5.noFill();

			if (landingPageState == 1) this.p5.strokeWeight(this.d * selectionStrokeRatio / 6);
			else this.p5.strokeWeight(this.d * selectionStrokeRatio * 2);

			this.p5.stroke("#ffffff")
			this.p5.ellipse(this.x, this.y, this.d + this.d * selectionStrokeRatio);
		}
		this.p5.noStroke();

		if (landingPageState == 1 && this.majorI == majorPlanetInFocus){
			
			// Display Minor Planet Text
			this.p5.fill("#ffffff");
			this.p5.textSize(textSize);
			this.p5.textAlign(this.p5.CENTER);
			this.p5.text(this.name, 
					this.x - this.d * textBoxRatio,
					this.y + this.d * 0.1,
					this.d * textBoxRatio * 2,
					this.p5.sqrt(this.p5.sq(this.d / 2) - this.p5.sq(this.d * textBoxRatio)));

		}

		return minorPlanetString;
	}
}

export default P5Page;