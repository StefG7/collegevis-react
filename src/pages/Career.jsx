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

const Table = ({data}) => {
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
                    <td>{ item[0] }</td>
                    <td><MinorTagsTable minorCategories={JOB_MINOR_CATEGORIZATION[item[0]]}></MinorTagsTable></td>
                    <td><ExternalLink link={"https://www.onetonline.org/"}></ExternalLink></td>
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
    }

    render() {
        return (
            <div className="container-fluid">
                <div className="row">
                    <div className="col-sm-6 title">
                        <h1>{this.props.minorSelections[0]}</h1>
                    </div>
                    <div className="col-sm-6 title">
                        <h1>Discovered Careers</h1>
                    </div>
                </div>
                <div className="row">
                    <div className="col-sm-6 title">
                        {/* eventually all the sample information shown below will be passed down as props or imported */}
                        <img className="img-fluid rounded mx-auto d-block" src="https://github.com/StefG7/collegevis-react/blob/main/public/pexels-mario-schafer-11322619.jpg?raw=true" alt="Chefs rolling out dough" />
                        <br /><br />
                        <div className="row mx-5">
                            <h3>{JOBS[0].title}</h3>
                            <p className="othernames">
                                {JOBS[0].also_called.title[0]}, {JOBS[0].also_called.title[0]}, {JOBS[0].also_called.title[0]}...
                            </p>
                            <br /><br />
                            <p>{JOBS[0].what_they_do}</p>
                        </div>
                    </div>
                    <div className="col-sm-6 title">
                        <Table data={ this.props.shownJobs }/>
                    </div>
                </div>
            </div>
        )
    }
}

export default Career
