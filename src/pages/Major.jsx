import React from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import { MAJOR_DATA_SAMPLE } from "../constants";
import { CAMPUS_DET } from "../data/campus_details";
// import Map from "../components/Map";
// import Info from "../components/Info";
import 'leaflet/dist/leaflet.css';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
// import { FaInfoCircle } from 'react-icons';

/* Table Generating Function

    1. Takes in data about majors and their campus from the "constants.js" file.
    2. Sets the table header and 3 columns. 
    3. Iterates through the data to populate table with rows.

*/

const Table = () => {
    return (
        <div className="tableContainer">
            <table className="table table-light table-striped">
            <thead>
                <tr>
                <th scope="col">#</th>
                <th scope="col">Major</th>
                <th scope="col">Campus</th>
                </tr>
            </thead>
            <tbody>
            {MAJOR_DATA_SAMPLE.map((item, index) => {
                return (
                    <tr key={ index + 2 }>
                    <th scope="row">{ index + 1 }</th>
                    <td>{ item.major }</td>
                    <td>{ item.campus }</td>
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
            {MAJOR_DATA_SAMPLE.map((item,index) => {
                return (
                    <Marker position={[item.lat, item.lon]} key={index*40+7}
                        eventHandlers={{
                        mouseover: (event) => event.target.openPopup(),
                        click: (event) => props.markerFunc(item.campus, item.key)}}
                        >
                        <Popup>
                            {item.campus} <br /> {item.city}
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
        this.setState({
            img_url: CAMPUS_DET[key].details.img,
            size: CAMPUS_DET[key].details.size,
            address: CAMPUS_DET[key].details.address,
            phone: CAMPUS_DET[key].details.phone,
            web: CAMPUS_DET[key].details.web,
            in_tui: CAMPUS_DET[key].details.in_tuition,
            out_tui: CAMPUS_DET[key].details.out_tuition,
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
    render() {
        return (
            <div className="container-fluid">
                <div className="row">
                    <div className="col-sm-6 title">
                        <h1>{this.props.minor}</h1>
                        <Table />
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
                                    <p><strong>Size: </strong>{this.state.size}</p>
                                    <p><strong>Address: </strong>{this.state.address}</p>
                                    <p><strong>Phone: </strong>{this.state.phone}</p>
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
