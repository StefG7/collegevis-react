import React, {useEffect} from 'react';
import p5 from 'p5';
import './P5Background.css';

import {UNI_COLORS, MAJOR_CATEGORIES, MAJOR_COLORS, EVENT_CODE} from '../constants.jsx';

let numBalls = MAJOR_CATEGORIES.length;
let ballSizeRatio = 0.1;
let spring = 0.05;
let gravity = 0.03;
let friction = -0.9;
let balls = [];

class P5Background extends React.Component {
	constructor(props) {
		super(props);
		this.myRef = React.createRef();
		this.canvasCreated = false;
	}
	
	Sketch = (p5) => {

		p5.setup = () => {
			p5.createCanvas(p5.windowWidth, p5.windowHeight);

			for (let i = 0; i < MAJOR_CATEGORIES.length; i++) {
				balls[i] = new Ball(
					p5.random(p5.width),
					p5.random(p5.height),
					p5.min(p5.windowWidth, p5.windowHeight) * ballSizeRatio,
					i,
					balls,
					p5
				);
			}
			p5.noStroke();
		}
   
		p5.draw = () => {
			p5.background(0);

			balls.forEach(ball => {
				ball.collide();
				ball.move();
				ball.display();
			});
		}

		p5.windowResized = () => {
			p5.resizeCanvas(p5.windowWidth, p5.windowHeight);
			for (let i = 0; i < MAJOR_CATEGORIES.length; i++){
				balls[i].diameter = p5.min(p5.windowWidth, p5.windowHeight) * ballSizeRatio;
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
			<div ref={this.myRef} className="p5Container"></div>
		);
	}
}

class Ball {
	constructor(xin, yin, din, idin, oin, p5) {
	  this.x = xin;
	  this.y = yin;
	  this.vx = 0;
	  this.vy = 0;
	  this.diameter = din;
	  this.id = idin;
	  this.others = oin;
	  this.p5 = p5;
	}
  
	collide(){
	  for (let i = this.id + 1; i < numBalls; i++) {
		//console.log(this.others[i]);
		let dx = this.others[i].x - this.x;
		let dy = this.others[i].y - this.y;
		let distance = this.p5.sqrt(dx * dx + dy * dy);
		let minDist = this.others[i].diameter / 2 + this.diameter / 2;
		//   console.log(distance);
		//console.log(minDist);
		if (distance < minDist) {
		  //console.log("2");
		  let angle = this.p5.atan(dy, dx);
		  let targetX = this.x + this.p5.cos(angle) * minDist;
		  let targetY = this.y + this.p5.sin(angle) * minDist;
		  let ax = (targetX - this.others[i].x) * spring;
		  let ay = (targetY - this.others[i].y) * spring;
		  this.vx -= ax;
		  this.vy -= ay;
		  this.others[i].vx += ax;
		  this.others[i].vy += ay;
		}
	  }
	}
  
	move(){
	  this.vy += gravity;
	  this.x += this.vx;
	  this.y += this.vy;
	  if (this.x + this.diameter / 2 > this.p5.width) {
		this.x = this.p5.width - this.diameter / 2;
		this.vx *= friction;
	  } else if (this.x - this.diameter / 2 < 0) {
		this.x = this.diameter / 2;
		this.vx *= friction;
	  }
	  if (this.y + this.diameter / 2 > this.p5.height) {
		this.y = this.p5.height - this.diameter / 2;
		this.vy *= friction;
	  } else if (this.y - this.diameter / 2 < 0) {
		this.y = this.diameter / 2;
		this.vy *= friction;
	  }
	}
  
	display(){
	  this.p5.fill(MAJOR_COLORS[MAJOR_CATEGORIES[this.id]]);
	  this.p5.ellipse(this.x, this.y, this.diameter, this.diameter);
	}
  }

export default P5Background;