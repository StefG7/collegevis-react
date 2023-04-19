import { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-tooltip/dist/react-tooltip.css';
import './App.css';

import { Tooltip } from 'react-tooltip'

import P5Page from './pages/P5Page';
import Major from './pages/Major';
import Career from './pages/Career';

import {EditDist} from './utility';

// Constant var and data loading
import {PAGE_STATE} from './constants.jsx';
import { MAJOR_MINOR_CATEGORIZATION, MINOR_CATEGORIZATION_MAJOR } from "./data/major_minor_categorization";
import { JOB_MINOR_CATEGORIZATION, MINOR_CATEGORIZATION_JOB} from "./data/job_minor_categorization";

function App() {
    const [state, setState] = useState(PAGE_STATE["Home"]);
    const [minorSelections, setMinorSelections] = useState([]);
    const [shownMajors, setShownMajors] = useState([]); // format: [[major_id1, edit_dist1], ...]
    const [shownJobs, setShownJobs] = useState([]); // format: [[job_title1, edit_dist1], ...]

    // Handle change of minor selection here, filter major and careers
    function handleMinorChange(selections) {
        setMinorSelections(selections);

        // #############
        // Filter Majors
        // #############
        let newShownMajors = [];
        let major_ids = new Set();

        // Add all majors under that category into major_ids
        for (let i = 0; i < selections.length; i++) {
            if (MINOR_CATEGORIZATION_MAJOR.hasOwnProperty(selections[i])){
                for (let j = 0; j < MINOR_CATEGORIZATION_MAJOR[selections[i]].length; j++){
                    major_ids.add(MINOR_CATEGORIZATION_MAJOR[selections[i]][j])
                }
            }
        }

        // Iterate through major_ids, calculate distance
        let major_id_iter = major_ids.values();
        let major_i = -1;
        while (major_i = major_id_iter.next().value) {
            newShownMajors.push([major_i, EditDist(MAJOR_MINOR_CATEGORIZATION[major_i], selections)])
        }

        // Sort by distance
        newShownMajors.sort((a,b) => (a[1] - b[1]));
        setShownMajors(newShownMajors);

        // #############
        // Filter Jobs
        // #############
        let newShownJobs = [];
        let job_ids = new Set();

        // Add all jobs under that category into job_ids
        for (let i = 0; i < selections.length; i++) {
            if (MINOR_CATEGORIZATION_JOB.hasOwnProperty(selections[i])){
                for (let j = 0; j < MINOR_CATEGORIZATION_JOB[selections[i]].length; j++){
                    job_ids.add(MINOR_CATEGORIZATION_JOB[selections[i]][j])
                }
            }
        }

        // Iterate through major_ids, calculate distance
        let job_id_iter = job_ids.values();
        let job_i = -1;
        while (job_i = job_id_iter.next().value) {
            newShownJobs.push([job_i, EditDist(JOB_MINOR_CATEGORIZATION[job_i], selections)])
        }
        
        // Sort by distance
        newShownJobs.sort((a,b) => (a[1] - b[1]));
        setShownJobs(newShownJobs);
    }

    return (
        <div className='container-fluid'>
            <Tooltip id="my-tooltip" />
            {state != PAGE_STATE["Home"] &&
                <div className='row'>
                    <div className='btn-layout col-sm-6'>
                            <button className='btn' onClick={() => setState(PAGE_STATE["Home"])}>Home</button>
                    </div>
                    <div className='btn-layout col-sm-6' style={{display: 'flex', justifyContent:'flex-end'}}>
                        {state == PAGE_STATE["Majors"] &&
                            <button className='btn' onClick={() => setState(PAGE_STATE["Careers"])}>Go to Careers</button>}
                        {state == PAGE_STATE["Careers"] &&
                            <button className='btn' onClick={() => setState(PAGE_STATE["Majors"])}>Go to Majors</button>}
                    </div>
                </div>
            }

            <div>
                {state == PAGE_STATE["Majors"] && <Major minorSelections={minorSelections}
                                                          shownMajors={shownMajors}/>}
                {state == PAGE_STATE["Careers"] && <Career minorSelections={minorSelections}
                                                          shownJobs={shownJobs}/>}
                {state == PAGE_STATE["Home"] && 
                    <img className='logo' src="assets/Pathways-Logo.png" alt="Pathways Logo" />
                }
                <P5Page pageState={state}
                        setState={setState}
                        minorSelections={minorSelections}
                        setMinorSelections={handleMinorChange}
                />
            </div>
            {/* Make FirstPage prop reactive to pass clicked minor category events from P5Background to Details page*/}
            {/* <P5Background /> */}
        </div>
    );

}

export default App

