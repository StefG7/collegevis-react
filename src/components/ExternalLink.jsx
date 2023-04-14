import React, { useState } from "react";
import {IoOpenOutline} from "react-icons/io5";

class ExternalLink extends React.Component {
    constructor() {
        super();
    }

    render() {
        return (
            <a  href={this.props.link}  target="_blank">
            <IoOpenOutline className="external_link_icon"
                 alt="External_Link"></IoOpenOutline>
            </a>
        );
    }
  };
    
  export default ExternalLink;