import React, {useEffect} from 'react';
import '../App.css'

import { IoClose } from 'react-icons/io5';
import {MAJOR_COLORS, MINOR_CATEGORIES, MAJOR_CATEGORIES, MINOR_COLORS} from '../constants.jsx';


class MinorTags extends React.Component {
	constructor(props) {
		super(props);
	}

    render() {
		return (
            <div id="MinorTags">
                {this.props.minorSelections.map(tag => (
                    <MinorT
                        key={tag} tag={tag}
                        minorSelections={this.props.minorSelections}
                        setMinorSelections={this.props.setMinorSelections}
                    >
                    </MinorT> 
                ))}
            </div>
			);
	}
}

class MinorT extends React.Component {
	constructor(props) {
		super(props);

        this.cancelMe = this.cancelMe.bind(this);
	}

    cancelMe() {
        let minorSelection = this.props.minorSelections.map((x)=>x); // create a copy
        let index = minorSelection.indexOf(this.props.tag);
        minorSelection.splice(index, 1);
        if (index > -1) this.props.setMinorSelections(minorSelection);
        else console.log("ERROR: MinorT cannot be deleted, this is not supposed to happen.")
    }

    render() {
        let major = ""
        for (let i = 0; i < MAJOR_CATEGORIES.length; i++){
            if (MINOR_CATEGORIES[MAJOR_CATEGORIES[i]].indexOf(this.props.tag) > -1){
                major=MAJOR_CATEGORIES[i];
                break;
            }
        }

        return (
            // "borderColor": MINOR_COLORS[this.props.tag] change colors to match minor cat
            <p className='mt-2 p-1' style={{"backgroundColor": MINOR_COLORS[this.props.tag]}}
                onClick={this.cancelMe}>
                <IoClose color='#3b3a4cff'/> {this.props.tag}
                <a className='redCancel'><IoClose/></a> 
            </p>
        )
    }
}

export default MinorTags;