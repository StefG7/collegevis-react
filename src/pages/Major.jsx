import React from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
// import Map from "../components/Map";
// import Info from "../components/Info";
import 'leaflet/dist/leaflet.css';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import { IoInformationCircle, IoLocationSharp, IoCall, IoGlobeOutline} from "react-icons/io5";

import ExternalLink from "../components/ExternalLink";
import MinorTagsTable from "../components/MinorTagsTable";

// Data Loading
import { MAJOR_DATA_SAMPLE } from "../constants";
import { CAMPUS_DET_2 } from "../data/campus_details";
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

let crazyIcon = L.icon({
    iconUrl: 'assets/check-icon.png',
    iconSize: [40, 40],
    iconAnchor: [12, 12],
    popupAnchor: [0, 0],
})

// L.Marker.prototype.options.icon = DefaultIcon;

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
                        <td>{ ALL_MAJORS[majID][0] } 
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
            <MapContainer center={[36.778259, -119.417931]} zoom={6} scrollWheelZoom={true}>
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            /> 
            {/* {MAJOR_DATA_SAMPLE.map((item,index) => { */}
            {CAMPUS_DET_2.map((item,index) => {
                return (
                    <Marker icon={crazyIcon} position={[item[3], item[2]]} key={index*40+7}
                        eventHandlers={{
                        mouseover: (event) => event.target.openPopup(),
                        click: (event) => props.markerFunc(item[1], item[0])}}
                        >
                        <Popup>
                            {item[1]} <br /> {item[5] + ", CA"}
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

    setDetails(key) {
        // console.log(key)
        CAMPUS_DET_2.map((item,index) => {
            item.some(element => {
                if (element == key) {
                    console.log("✅ array has key " + key + " at index " + index)
                    this.setState({
                        img_url: 'https://www.tclf.org/sites/default/files/styles/crop_2000x700/public/thumbnails/image/CA_Berkeley_UniversityOfCaliforniaAtBerkeley_courtesyWikimediaCommons_2015_003_Hero.jpg?itok=3xgaYihl',
                        size: '20,000 placeholder',
                        address: CAMPUS_DET_2[index][4] + ", " + CAMPUS_DET_2[index][5] + ", CA " + CAMPUS_DET_2[index][6],
                        phone: CAMPUS_DET_2[index][7],
                        web: 'imaginary website',
                        in_tui: CAMPUS_DET_2[index][8],
                        out_tui: CAMPUS_DET_2[index][9],
                    })
                } 
                // else {
                //     console.log("Error, didn't find matching key!")
                // }
            })
        })
    }

    markerFunc(name,key) {
        this.setState({
            myclass: 'expanded',
            selected: 'selected',
            campus_key: toString(key)
        })
        this.setCampus(name)
        this.setDetails(key)
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
                    <div className="col-sm-6 title">
                        <h2> Discovered Majors</h2>
                        <Table shownMajors={this.shownMajors} />
                    </div>
                    <div className="col-sm-6">
                        <div className="row">
                            <Map markerFunc ={this.markerFunc}/> 
                        </div>
                        <div className="row">
                            {/* <Info /> */}
                            <div id="detail" className={this.state.myclass}>
                                <div className="row mt-3">
                                    <button className="btn btn-slider" onClick={this.divclicked}></button>
                                </div>
                                <div id="campus" className="row">
                                    <h1 className={"resize " + this.state.selected}>{this.state.campus}</h1>
                                    
                                    <img id="img-fluid" className={this.state.selected} src={this.state.img_url} alt="Placeholder Campus Image" />
                                </div>
                                <div id="overview" className={"row " + this.state.selected}>
                                    <h2><b>Overview</b></h2>
                                    <br />
                                    <p><IoInformationCircle/> {this.state.size}</p>
                                    <p><IoLocationSharp/> {this.state.address}</p>
                                    <p><IoCall/> {this.state.phone}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default Major
