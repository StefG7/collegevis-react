import React from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import JOBS from '../data/final_jobs.json';
import { JOB_DATA } from "../data/job_data";

import ExternalLink from "../components/ExternalLink";
import MinorTagsTable from "../components/MinorTagsTable";

import { JOB_MINOR_CATEGORIZATION } from '../data/job_minor_categorization';

/* Table Generating Function

    1. Takes in data about majors and their campus from the "constants.js" file.
    2. Sets the table header and 3 columns. 
    3. Iterates through the data to populate table with rows.

    Can separate this into its own component later on if needed. 

*/

const Table = ({data, jobClicked}) => {
    return (
        <div className="tableContainer">
            <table className="table table-light table-striped">
            <thead>
                <tr>
                <th scope="col">Career</th>
                <th scope="col">Categories</th>
                <th scope="col">Link</th>
                </tr>
            </thead>
            <tbody>
            {data.map((item, index) => {
                return (
                    <tr key={ index * 20 + 5 }>
                    <td onClick={(e) => jobClicked(e.target.innerText)} className="clickableTableCell">{ item[0] }</td>
                    <td><MinorTagsTable minorCategories={JOB_MINOR_CATEGORIZATION[item[0]]}></MinorTagsTable></td>
                    <td><ExternalLink link={JOB_DATA[item[0]][3]}></ExternalLink></td>
                    </tr>
                );
            })}
            </tbody>
            </table>
        </div>
    );
}


/* Main Detail Component for Majors

Contains the overall layout of the detail page and calls other nested functions/components.

*/


class Career extends React.Component{
    constructor() {
        super();
        this.state = {
         selectedJobTitle: '',
        }
        this.jobClicked = this.jobClicked.bind(this);
    }
    
    jobClicked(name) {
        console.log(name);
        this.setState({
            selectedJobTitle: name
        });
     }

    render() {
        let jobtitle = this.props.shownJobs.length ? this.props.shownJobs[0][0] : '';
        jobtitle = this.state.selectedJobTitle ? this.state.selectedJobTitle : jobtitle;

        return (
            <div className="container-fluid">
                <div className="row" style={{"pointerEvents":"None"}}>
                    <div className="col-sm-6 title">
                        {/* <h1>{this.props.minorSelections[0]}</h1> */}
                    </div> 
                    <div className="col-sm-6 title">
                        <h1>Discovered Careers</h1>
                    </div>
                </div>
                <div className="row">
                    <div className="col-sm-6 title">
                        {/* eventually all the sample information shown below will be passed down as props or imported */}
                        <div className="career-pic row mb-3">
                            <img id="career-img" src="assets/campus/pexels-mario-schafer-11322619.jpg" alt="Chefs rolling out dough" />
                        </div>
                        <div className="row mx-4">
                            <div className="row career mb-1 p-3 ml-2">
                                <h3>{jobtitle ? jobtitle : "No Job Found"}</h3>
                                { jobtitle ? 
                                    <div className="othernames">
                                        <p>
                                        <strong>Also called: </strong>
                                            {JOB_DATA[jobtitle][0][0]},&nbsp;
                                            {JOB_DATA[jobtitle][0][1]},&nbsp;
                                            {JOB_DATA[jobtitle][0][2]}...
                                        </p> 
                                    </div>
                                : ''
                                }
                                {/* what they do*/}
                                <p>{jobtitle ? JOB_DATA[jobtitle][1] : ''}</p>
                            </div>
                            <div className="row my-4">
                                <div className="tasks">
                                    <h4><strong>Tasks:</strong></h4>
                                    { jobtitle ? 
                                    <ul>
                                        <li>{JOB_DATA[jobtitle][2][0]}</li>
                                        <li>{JOB_DATA[jobtitle][2][1]}</li>
                                        <li>{JOB_DATA[jobtitle][2][2]}</li>
                                    </ul>
                                    : ''}
                                </div>
                                <div className="col-sm-3">
                                        {console.log(jobtitle)}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-sm-6 title">
                        <Table data={ this.props.shownJobs } jobClicked={ this.jobClicked }/>
                    </div>
                </div>
                <div className="row source">
                    <p>Data sourced from <a href="https://www.onetonline.org/" target="_blank" rel="noopener noreferrer">O*NET OnLine</a>  | Nov. 2022</p>
                </div>
            </div>
        )
    }
}

export default Career
