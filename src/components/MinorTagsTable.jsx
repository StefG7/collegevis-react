import React, {useEffect} from 'react';
import '../App.css'

import {MAJOR_COLORS, MINOR_CATEGORIES, MAJOR_CATEGORIES, MINOR_COLORS} from '../constants.jsx';

// One used in detail page to display the tags

class MinorTagsTable extends React.Component {
	constructor(props) {
		super(props);
	}

    render() {
		return (
            <div className="MinorTagsTable">
                {this.props.minorCategories.map(tag => (
                    <MinorTTable
                        key={tag} tag={tag}
                    ></MinorTTable> 
                ))}
            </div>
			);
	}
}

class MinorTTable extends React.Component {
	constructor(props) {
		super(props);
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
            <p style={{"backgroundColor": MINOR_COLORS[this.props.tag],
                        "borderColor": MINOR_COLORS[this.props.tag]}}    
                data-tooltip-id="my-tooltip" 
                data-tooltip-content={this.props.tag}
                data-tooltip-place="right">
                &nbsp;
            </p>
        )
    }
}

export default MinorTagsTable;