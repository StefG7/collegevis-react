import React, { useState } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';

class Info extends React.Component {
    constructor() {
        super();
        this.state = {
         myclass: '',
         }
      this.divclicked = this.divclicked.bind(this);
      }
     
      divclicked() {
       if (this.state.myclass === '') {
        this.setState({
         myclass: 'expanded'
        })
       }
      else {
       this.setState({
         myclass: '',
       })
      }
     }

    render() {
        return (
            <div id="detail" className={this.state.myclass}>
                <div className="row mt-3">
                    <button className="btn btn-slider" onClick={this.divclicked}></button>
                </div>
                <div className="row mt-5" style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <h1>Campus Map</h1>
                    
                </div>
            </div>
        );
    }
  };
    
  export default Info;