import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import Images from '../../api/Images.js';
import AddToContactList from './AddToContactList.jsx';

export default class SingleEntry extends Component {

  getImage() {
    Meteor.subscribe('images');
    image = Images.findOne({'meta.entryId': this.props.entry._id});
    return (typeof image !== "undefined" ? image.link() : "");
  }

  renderAreas(areas) {
    if(typeof areas !== "undefined" && areas) {
      return areas.map((area) => (
        <div key={area._id} className="place-label-list label label-primary">
          {area.mun}
        </div>
      ));
    }
  }

  renderBusses(bus) {
    if(typeof bus !== "undefined" && bus) {
      return bus.map((bus) => (
        <div key={bus._id} className="place-label-list label label-info">
          {bus.bname}
        </div>
      ));
    }
  }

  render() {
    return (
      <div className="single-entry row">
        <div className="col-sm-2">
          <img src={this.getImage()} className="img-responsive" />
        </div>
        <div className="col-sm-10">
          <h4 className="list-title">
            <Link to={`e/${this.props.entry._id}`}>
              {this.props.entry.name}
            </Link>
          </h4>
          <AddToContactList entryId={this.props.entry._id} size="sm" />
          <div className="clearfix"></div>
            <div className="label-area">
              {this.renderBusses(this.props.entry.bus)}
              {this.renderAreas(this.props.entry.area)}
            </div>
            <p className="preview-text">
              {this.props.entry.text}
            </p>
        </div>
      </div>
    );
  }
}

SingleEntry.propTypes = {
  // This component gets the entry to display through a React prop.
  // We can use propTypes to indicate it is required
  entry: PropTypes.object.isRequired,
};
