import { useState, useEffect } from 'react';
import P5Page from './pages/P5Page'
import Major from './pages/Major'
import Career from './pages/Career';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css'

import {PAGE_STATE} from './constants.jsx';

function App() {
    const [state, setState] = useState(PAGE_STATE["Home"]);//"Majors");
    const [minorSelections, setMinorSelections] = useState([]);

    return (
        <div className='container-fluid'>
            {state != PAGE_STATE["Home"] &&
                <div className='row'>
                    <div className='btn-layout col-sm-6'>
                            <button className='btn' onClick={() => setState(PAGE_STATE["Home"])}>Home</button>
                    </div>
                    <div className='btn-layout col-sm-6' style={{display: 'flex', justifyContent:'flex-end'}}>
                        {state == PAGE_STATE["Majors"] &&
                            <button className='btn' onClick={() => setState(PAGE_STATE["Careers"])}>Go to Majors</button>}
                        {state == PAGE_STATE["Careers"] &&
                            <button className='btn' onClick={() => setState(PAGE_STATE["Majors"])}>Go to Careers</button>}
                    </div>
                </div>
            }

            <div>
                {state == PAGE_STATE["Careers"] && <Major minor="Food & Nutrition" />}
                {state == PAGE_STATE["Majors"] && <Career minor="Food & Nutrition" />}
                <P5Page pageState={state}
                        setState={(state) => {setState(state)}}
                        minorSelections={minorSelections}
                        setMinorSelections={(selections) => setMinorSelections(selections)}
                />
            </div>
            {/* Make FirstPage prop reactive to pass clicked minor category events from P5Background to Details page*/}
            {/* <P5Background /> */}
        </div>
    );

}

export default App

