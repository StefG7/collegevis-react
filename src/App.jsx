import { useState } from 'react';
import P5Background from './components/P5Background';
import Major from './components/Major'
import Career from './components/Career';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css'

function App() {
    const [state, setState] = useState("Majors");
    return (
        <div className='container-fluid'>
            <br/>
            <div className='btn-layout'>
                <button className='btn' onClick={() => setState("Home")}>Home</button>
                <br/><br/>
                {state === "Majors" && <button className='btn' onClick={() => setState("Careers")}>{state}</button>}
                {state === "Careers" && <button className='btn' onClick={() => setState("Majors")}>{state}</button>}
            </div>
            <div>
                {state === "Home" && <P5Background />}
                {state === "Majors" && <Major minor="Food & Nutrition" />}
                {state === "Careers" && <Career minor="Food & Nutrition" />}
                {/* <Detail2 minor="Food & Nutrition" /> */}
            </div>
            {/* Make this minor prop reactive to pass clicked minor category events from P5Background to Details page*/}
            {/* <P5Background /> */}
        </div>
    );

}

export default App

