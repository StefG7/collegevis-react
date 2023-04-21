import React, {useEffect} from 'react';
import '../App.css'

import {MINOR_CATEGORIES, MAJOR_CATEGORIES, MINOR_COLORS} from '../constants.jsx';
import {sort_minor} from '../utility.jsx';

// One used in detail page to display the tags
class MinorTagsTable extends React.Component {
	constructor(props) {
		super(props);
	}

    render() {
        let sorted_minor = sort_minor(this.props.minorCategories);
		return (
            <div className="MinorTagsTable">
                {sorted_minor.map(tag => (
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