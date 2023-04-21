import React from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'leaflet/dist/leaflet.css';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import { IoInformationCircle, IoLocationSharp, IoCall, IoGlobeOutline, IoPeople, IoEnter, IoSchool, IoCash, IoCashOutline} from "react-icons/io5";

import ExternalLink from "../components/ExternalLink";
import MinorTagsTable from "../components/MinorTagsTable";

// Data Loading
import { CAMPUS_DET } from "../data/campus_details2";
import { ALL_MAJORS } from '../data/all_major';
import { MAJOR_MINOR_CATEGORIZATION } from '../data/major_minor_categorization';

// Markers
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
// import check from 'public/assets/check-icon.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow
});

let customIcon = L.icon({
    iconUrl: 'assets/glow-2.png',
    iconSize: [40, 40], // changing size based on majors offered at campus
    iconAnchor: [12, 15],
    popupAnchor: [0, 0],
})

/* Table Generating Function

    1. Takes in data about majors and their campus from the "constants.js" file.
    2. Sets the table header and 3 columns. 
    3. Iterates through the data to populate table with rows.

*/

const OnlineIcon = () => {
    return(
        <IoGlobeOutline className="online_icon"
            alt="onlineIcon"
            data-tooltip-id="my-tooltip" 
            data-tooltip-content="Online Program" 
            data-tooltip-place="right"></IoGlobeOutline>
    );
}

const Table = (props) => {
    return (
        <div className="tableContainer">
            <table className="table table-light table-striped">
                <thead>
                    <tr>
                    <th scope="col">Major</th>
                    <th scope="col">Campus</th>
                    <th scope="col">Categories</th>
                    <th scope="col">Link</th>
                    </tr>
                </thead>
                <tbody>
                {props.shownMajors.map((item, index) => {
                    let majID = item[0]; 
                    return (
                        <tr key={ index }>
                        {/* <td onClick={() => props.markerFunc(ALL_MAJORS[majID][2])} className="clickableTableCell"> */}
                        <td>
                            { ALL_MAJORS[majID][0] + " "}
                            {ALL_MAJORS[majID][3] === "TRUE" && <OnlineIcon></OnlineIcon>}</td>
                        <td>{ ALL_MAJORS[majID][2] }</td>
                        <td><MinorTagsTable minorCategories={MAJOR_MINOR_CATEGORIZATION[majID]}></MinorTagsTable></td>
                        <td><ExternalLink link={"https://" + ALL_MAJORS[majID][4]}></ExternalLink></td>
                        </tr>
                    );
                })}
                </tbody>
            </table>
        </div>
    );
}

/* Map Generating Function

    1. Takes in data about campuses and their location from the "constants.js" file.
    3. Iterates through the data to populate map with markers.

*/

const Map = (props) => {
    return (
        <div className="leaflet-container"> 
            <MapContainer center={[36, -119.9]} zoom={6} scrollWheelZoom={true}>
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            /> 
            {/* {MAJOR_DATA_SAMPLE.map((item,index) => { */}
            {CAMPUS_DET.map((item,index) => {
                return (
                    <Marker icon={customIcon} position={[item[3], item[2]]} key={index*40+7}
                        eventHandlers={{
                        mouseover: (event) => event.target.openPopup(),
                        mouseout: (event) => event.target.closePopup(),
                        click: (event) => props.markerFunc(item[1])}}
                        >
                        <Popup>
                            <strong>{item[1]}</strong> <br /> {item[5] + ", CA"}
                        </Popup>
                    </Marker>
                );
            })}
            </MapContainer>
        </div>
    );
}


/* Main Detail Component for Majors

Contains the overall layout of the detail page and calls other nested functions/components.

*/


class Major extends React.Component{
    constructor() {
        super();
        this.state = {
         myclass: '',
         campus: 'Pick a Campus on the Map!',
         campus_key: '',
         selected: '',
         img_url: '',
         size: '',
         address: '',
         phone: '',
         web: '',
         in_tui: '',
         out_tui: '',
         app: '',
         liv_cam: '',
         liv_off: '',
         }
        this.divclicked = this.divclicked.bind(this);
        this.setCampus = this.setCampus.bind(this);
        this.markerFunc = this.markerFunc.bind(this);
        this.setDetails = this.setDetails.bind(this);
        this.shownMajors = []; // shownMajors will be changed here based on campus in focus
    }
     
    divclicked() {
       if (this.state.myclass === '') {
        this.setState({
            myclass: 'expanded'
        })
       }
      else {
       this.setState({
         myclass: ''
       })
      }
    }

    setCampus(name) {
        this.setState({
            campus: name
        })
    }

    setDetails(name) {
        // console.log(key)
        CAMPUS_DET.map((item,index) => {
            item.some(element => {
                if (element == name) {
                    // console.log("✅ array has key " + key + " at index " + index)
                    this.setState({
                        img_url: CAMPUS_DET[index][15],
                        size: CAMPUS_DET[index][10],
                        address: CAMPUS_DET[index][4] + ", " + CAMPUS_DET[index][5] + ", CA " + CAMPUS_DET[index][6],
                        phone: CAMPUS_DET[index][7],
                        web: CAMPUS_DET[index][11],
                        in_tui: CAMPUS_DET[index][8],
                        out_tui: CAMPUS_DET[index][9],
                        app: CAMPUS_DET[index][12],
                        liv_cam: CAMPUS_DET[index][13],
                        liv_off: CAMPUS_DET[index][14],
                    })
                } 
                // else {
                //     console.log("Error, didn't find matching key!")
                // }
            })
        })
    }

    markerFunc(name) {
        console.log(name)
        this.setState({
            myclass: 'expanded',
            selected: 'selected'
        })
        this.setCampus(name)
        this.setDetails(name)
    }

    populateShownMajor() {  
        // If a uni is selected, push the major list of that university to the top
        let uni_list = []; // majors in the selected uni

        // Copy
        this.shownMajors = [];
        for (let i = 0; i < this.props.shownMajors.length; i++)
            this.shownMajors.push(this.props.shownMajors[i]);

        // Push the university major to the top
        let l = this.shownMajors.length;
        for (let i = 0; i < l; i++){
            if (ALL_MAJORS[this.shownMajors[i][0]][2] == this.state.campus) {
                uni_list.push(this.shownMajors.splice(i, 1)[0]);
                i--;
                l--;
            }
        }

        this.shownMajors = uni_list.concat(this.shownMajors);
    }

    render() {
        this.populateShownMajor();
        return (
            <div className="container-fluid">
                <div className="row">
                    <div className="col-sm-6 title" style={{"pointerEvents":"none"}}>
                        <h2 > Discovered Majors</h2>
                        <br />
                        <div style={{"pointerEvents":"auto"}}><Table shownMajors={this.shownMajors} markerFunc={this.markerFunc}/></div>
                    </div>
                    <div className="col-sm-6">
                        <div className="row">
                            <Map markerFunc={this.markerFunc}/> 
                        </div>
                        <div className="row">
                            {/* <Info /> */}
                            <div id="detail" className={"scroll " + this.state.myclass}>
                                <div className="row mt-3">
                                    <button className="btn btn-slider" onClick={this.divclicked}></button>
                                </div>
                                <div id="campus" className="row">
                                    <h1 className={"resize " + this.state.selected}>{this.state.campus}</h1>
                                    <div className={this.state.selected} color="black">
                                        <img id="img-fluid" className={this.state.selected} src={this.state.img_url} alt="Placeholder Campus Image" />
                                    </div>
                                </div>
                                <div id="overview" className={"row " + this.state.selected}>
                                    <div className="row">
                                        <h2><b>Overview</b></h2>
                                        <div className="col-sm-8 mt-3">
                                            <p><IoInformationCircle color="#ef5c29ff"/> <a href={this.state.web} target="_blank" rel="noopener noreferrer">{this.state.web}</a></p>
                                            <p><IoPeople color="#ef5c29ff"/> {this.state.size}</p>
                                            <p><IoLocationSharp color="#ef5c29ff"/> {this.state.address}</p>
                                            <p><IoCall color="#ef5c29ff"/> {this.state.phone}</p>
                                        </div>
                                        <div className="col-sm-4 mt-3">
                                            {/* <div className="row mx-6"><a className="btn" href={this.state.web} target="_blank" rel="noopener noreferrer"><IoEnter/>  Webpage</a></div> */}
                                            <div className="row mx-3 mt-2"><a id="app" className="btn" href={this.state.app} target="_blank" rel="noopener noreferrer">  Apply <br></br> <IoSchool className="mt-2 lg"/></a></div>
                                        </div>
                                    </div>
                                </div>
                                <div id="cost" className="row mt-3">
                                    <div className="col-sm-6">
                                        <h2 className="my-3">Tuition + Fees</h2>
                                        <p><IoCash/> <strong>{this.state.in_tui}</strong> in-state tuition</p>
                                        <p><IoCashOutline/> <strong>{this.state.out_tui}</strong> out-of-state</p>
                                    </div>
                                    <div className="col-sm-6">
                                        <h2 className="my-3">Housing</h2>
                                        <p><IoCash/> <strong>{this.state.liv_cam}</strong> on-campus</p>
                                        <p><IoCashOutline/> <strong>{this.state.liv_off}</strong> off-campus w/o family</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row source2">
                    <p>Data sourced from <a href="https://educationdata.urban.org/data-explorer" target="_blank" rel="noopener noreferrer">Educational Data Explorer</a> | Nov. 2022</p>
                </div>  
            </div>
        )
    }
}

export default Major
