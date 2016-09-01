import React, { Component } from 'react';
import Lint from './Lint';

export default class Lints extends Component {
  render(){
    var lints = [], i = 0;
    this.props.lints.forEach(function(lint) {
      i++;
      lints.push(<Lint key={i} lint={lint} />);
    });

    return (
      <div>
        <div className="alert alert-info" role="alert">
          <strong>Bootlint found {lints.length} problems</strong>
        </div>
        <div className="panel panel-default">
          {lints}
        </div>
      </div>
    );
  }
}
