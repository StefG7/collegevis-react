import React, { useState } from "react";

class ExternalLink extends React.Component {
    constructor() {
        super();
    }

    render() {
        return (
            <a  href={this.props.link}  target="_blank">
            <img className="external_link_icon"
                 src="public/assets/external-link.png"
                 href={this.props.link}
                 alt="External_Link"
                 pointerEvents="inherit"></img>
            </a>
        );
    }
  };
    
  export default ExternalLink;