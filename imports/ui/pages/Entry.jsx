import React, { Component, PropTypes } from 'react';
import { Entries } from '../../api/Entries.js';
import ReactDOM from 'react-dom';
import ShowWysiwyg from '../components/ShowWysiwyg.jsx';
import Wysiwyg from '../components/Wysiwyg.jsx';
import AreaComp from '../components/AreaComp.jsx';
import { createContainer } from 'meteor/react-meteor-data';

class Entry extends Component {
  constructor(props) {
    super(props);
    this.state = {
      edit: false,
      addedSuggestions: [],
      editorContent: {},
    };
    this.initState = () => this.iniTe(e);
  }

  iniTe(){
    this.setState({addedSuggestions: this.props.entry.area});
  }

  handleSubmit(event) {
    event.preventDefault();
    // Find the text field via the React ref
    const name = ReactDOM.findDOMNode(this.refs.nameInput).value.trim();
    const text = ReactDOM.findDOMNode(this.refs.textInput).value.trim();
    const area = this.state.addedSuggestions;
    const mainContent = this.state.editorContent;
    Meteor.call('entries.update', this.props.entry._id, name, text, area, mainContent);
  }

  editName(res) {
    return (
      <input
        className="form-control entry-input"
        type="name"
        ref="nameInput"
        defaultValue={res.name}
        placeholder="Name of the entry"
        id="nameInput"
        />
    );
  }

  editText(res) {
    return (
        <input
          className="form-control entry-input"
          type="name"
          ref="textInput"
          defaultValue={res.text}
          placeholder="A short description text"
          id="textInput"
          />
    );
  }

  handleContent(a) {
    this.setState({
      editorContent: a
    });
  }

  editLabels(area) {
    return (
      <span className="pull-right-container remove-label"
          onClick={this.removeLabel.bind(this, area._id.toString())}>
        <i className="fa fa-times"></i>
      </span>
    );
  }

  removeLabel(id){
    var array = this.state.addedSuggestions.filter(function(item) {
      return item._id.toString() !== id
    });

    this.setState({
      addedSuggestions: array
    });
  }

  onUpdate(val){
    this.setState({
      addedSuggestions: this.state.addedSuggestions.concat([val])
    });
  }

  renderAreas(areas) {
    return areas.map((area) => (
      <div key={area._id} className="place-label label label-primary">
        { area.mun }
      </div>
    ));
  }

  renderStateAreas() {
    return this.state.addedSuggestions.map((area) => (
      <div key={area._id} className="place-label label label-primary">
        { area.mun } { this.props.edit ? this.editLabels(area) : "" }
      </div>
    ));
  }

  onClick(e) {
    e.preventDefault;
    this.props.toggleStateOff();
  }

  render() {
    let res = this.props.entry;
    if(!res) {
      return <div className="container">Loading</div>
    }
    return (
      <div className="container">
        { this.props.edit ?
        <div className="row">
          <div className="edit-panel col-xs-12">
            <div className="edit-panel-left pull-left">
              <button className="btn btn-default">Test</button>
            </div>

            <div className="pull-right edit-controls">
              <button className="btn btn-success" onClick={this.handleSubmit.bind(this)}>Save</button>
              <button className="btn btn-warning" onClick={this.onClick.bind(this)}>Cancel</button>
            </div>
          </div>
        </div> : ""
        }
        <div className="jumbotron">
          <div className="row">
            <div className="col-sm-3 logo-container">
              <img src="/img/example-logo.png" className="img-responsive logo-image" />
            </div>
            <div className="col-sm-9 name-container">
              {this.props.edit ? this.editName(res) : <h2 className="header-title">{res.name}</h2> }
              {this.props.edit ? this.editText(res) : <p className="lead">{res.text}</p> }
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-sm-12">
            <div className="alert alert-success">
              <strong>Business area:</strong> {this.props.edit ? this.renderStateAreas() : this.renderAreas(res.area)}
              {this.props.edit ?
                <div className="inline-block">
                  <AreaComp onUpdate={this.onUpdate.bind(this)} />
                </div>
                : "" }
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-sm-12">
            <div className="content-box">
              {this.props.edit ?
                <Wysiwyg onSelectLanguage={this.handleContent.bind(this)} mainContent={res.mainContent} /> :
                <ShowWysiwyg mainContent={res.mainContent} /> }
            </div>
          </div>
        </div>
      </div>
    )
  }
};

export default EntryContainer = createContainer(({paramsId, params, toggleStateOff}) => {
  Meteor.subscribe('entries');
  if(paramsId) {
    return {
      entry: Entries.findOne(paramsId),
    }
  }

  return {
    entry: Entries.findOne(params.id),
  };
}, Entry);
