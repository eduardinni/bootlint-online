import React, { Component } from 'react';

export default class Lint extends Component {
  render(){
    var labelClass = (this.props.lint.id[0] === 'E') ? 'label label-danger' : 'label label-warning';
    var lintLocation = this.props.lint.location ? <span> Line {this.props.lint.location.line + 1}, Column {this.props.lint.location.column + 1}:</span> : null;
    return (
      <div className="panel-body">
        <span className={labelClass}>{this.props.lint.id}</span>
        {lintLocation}
        <strong>{this.props.lint.message}</strong>
        <a href="https://github.com/twbs/bootlint/wiki/{this.props.lint.id}" target="_blank" className="btn btn-link btn-xs">
          more details <span className="glyphicon glyphicon-new-window" aria-hidden="true"></span>
        </a>
      </div>
    );
  }
}
