import { useState } from 'react';
import FirstPage from './pages/FirstPage'
import Major from './pages/Major'
import Career from './pages/Career';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css'

function App() {
    const [state, setState] = useState("Majors");
    return (
        <div className='container-fluid'>
            <div className='row'>
                <div className='btn-layout col-sm-6'>
                    <button className='btn' onClick={() => setState("Home")}>Home</button>
                </div>
                <div className='btn-layout col-sm-6' style={{display: 'flex', justifyContent:'flex-end'}}>
                    {state === "Majors" && <button className='btn' onClick={() => setState("Careers")}>Go to {state}</button>}
                    {state === "Careers" && <button className='btn' onClick={() => setState("Majors")}>Go to {state}</button>}
                </div>
            </div>

            <div>
                {state === "Home" && <FirstPage />}
                {state === "Careers" && <Major minor="Food & Nutrition" />}
                {state === "Majors" && <Career minor="Food & Nutrition" />}
            </div>
            {/* Make FirstPage prop reactive to pass clicked minor category events from P5Background to Details page*/}
            {/* <P5Background /> */}
        </div>
    );

}

export default App

