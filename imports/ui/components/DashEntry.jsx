import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import Entry from '../pages/Entry.jsx';
import { browserHistory} from 'react-router'


export default class DashEntry extends Component {

  onClick(e) {
    e.preventDefault;
    this.props.getId(this.props.entry._id);
  }

  deleteThisEntry() {
    console.log("this");
    Meteor.call('entries.remove', this.props.entry._id, (err) => {
      if(err) {
        Bert.alert({
          title: 'Error',
          message: err.reason,
          type: 'danger',
          style: 'growl-top-right',
          icon: 'fa-bell'
        });
      }
      else {
        Bert.alert({
          title: 'Entry deleted',
          message: 'Now, make another!',
          type: 'danger',
          style: 'growl-top-right',
          icon: 'fa-bell'
        });
        browserHistory.push('/dashboard');
      }
    });
  }

  entryEditedAt(time){
    return moment(time).format("D.M.YYYY HH:mm:ss");;
  }

  publishEntry() {
    let published = !this.props.entry.published;
    Meteor.call('entries.updatePublication', this.props.entry._id, published)
    this.props.entry.published ? (
      Bert.alert({
        title: 'Entry is unpublished',
        message: 'Nobody can see it. Now, make it even better and then republish!',
        type: 'warning',
        style: 'growl-top-right',
        icon: 'fa-bell'
      })) : (
      Bert.alert({
        title: 'Entry published',
        message: 'Now it is live!',
        type: 'success',
        style: 'growl-top-right',
        icon: 'fa-check'
      }));
  }

  render() {
    return (
      <div className="single-entry row">
        <div className="col-xs-4">
          <div className={this.props.entry.published ? "preview-area" : "preview-area not-published"}>
            <div className="scrollable">
              <Entry paramsId={this.props.entry._id} />
            </div>
          </div>
        </div>
        <div className="col-xs-8 dash-area">
          <Link to={`e/${this.props.entry._id}`}>
            <h4 className="dash-title">{this.props.entry.name}</h4>
          </Link>
          { this.props.entry.editedAt ?
          <h4 className="dash-title"><small>Last edited {this.entryEditedAt(this.props.entry.editedAt)}</small></h4>
          : "" }
          <div className="row">
            <div className="col-xs-12">
              <a className="btn btn-primary btn-sm" onClick={this.onClick.bind(this)}>
                <i className="fa fa-pencil-square-o" aria-hidden="true"></i> Edit entry
              </a>
              <p className="edit-text dashboard-control-buttons">Edit contents of the entry</p>
            </div>
          </div>
          <div className="row">
            <div className="col-xs-12">
            {this.props.entry.published ?
              <a className="btn btn-success btn-sm" onClick={this.publishEntry.bind(this)}>
                <i className="fa fa-play" aria-hidden="true"></i> Published
              </a> :
              <a className="btn btn-warning btn-sm" onClick={this.publishEntry.bind(this)}>
                <i className="fa fa-stop" aria-hidden="true"></i> Not published
              </a>}
              <p className="edit-text dashboard-control-buttons">
                Publish or unpublish the entry. Not published entries are not shown to the users.
              </p>
            </div>
          </div>
          <div className="row">
            <div className="col-xs-12">
              <a className="btn btn-danger btn-sm" data-toggle="modal" data-target="#removeModal" >
              <i className="fa fa-trash" aria-hidden="true"></i> Remove
              </a>
              <p className="edit-text dashboard-control-buttons">Remove the entry :(</p>
                <div className="modal fade" id="removeModal" tabIndex="-1" role="dialog">
                  <div className="modal-dialog" role="document">
                    <div className="modal-content">
                      <div className="modal-header">
                        <button type="button" className="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                        <h4 className="modal-title">Remove entry</h4>
                      </div>
                      <div className="modal-body">
                        <p>You are about to delete <strong>{this.props.entry.name}</strong></p>
                      </div>
                      <div className="modal-footer">
                        <button type="button" className="btn btn-danger" data-dismiss="modal" onClick={this.deleteThisEntry.bind(this)}>
                          Delete entry
                        </button>
                        <button type="button" className="btn btn-default" data-dismiss="modal">Close</button>
                      </div>
                    </div>
                  </div>
                </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}