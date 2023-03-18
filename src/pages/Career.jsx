import React from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import { MAJOR_DATA_SAMPLE } from "../constants";


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
                <th scope="col">#</th>
                <th scope="col">Career</th>
                <th scope="col">O'Net Link</th>
                </tr>
            </thead>
            <tbody>
            {data.map((item, index) => {
                return (
                    <tr key={ index * 20 + 5 }>
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
                        <h1>List of Careers</h1>
                    </div>
                </div>
                <div className="row">
                    <div className="col-sm-6 title">
                        {/* eventually all the sample information shown below will be passed down as props or imported */}
                        <img className="img-fluid rounded mx-auto d-block" src="https://github.com/StefG7/collegevis-react/blob/main/public/pexels-mario-schafer-11322619.jpg?raw=true" alt="Chefs rolling out dough" />
                        <br /><br />
                        <div className="row mx-5">
                            <h3>Chefs and Head Cooks</h3>
                            <p>Direct and may participate in the preparation, seasoning, and cooking of salads, soups, fish, meats, vegetables, desserts, or other foods. May plan and price menu items, order supplies, and keep records and accounts.</p>
                        </div>
                    </div>
                    <div className="col-sm-6 title">
                        <Table data={ MAJOR_DATA_SAMPLE }/>
                    </div>
                </div>
            </div>
        )
    }
}

export default Career
