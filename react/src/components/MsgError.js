import React, { Component } from 'react';

export default class MsgError extends Component {
  render(){
    return (
      <div className="alert alert-danger" role="alert"><strong>Oops!</strong> {this.props.errorMsg}</div>
    );
  }
}
