import React, { Component } from 'react';

export default class PageHeader extends Component {
  render(){
    return (
      <div>
        <div className="page-header">
          <h1>Bootlint Online <span className="text-warning beta">beta</span></h1>
        </div>
        <p className="lead">An HTML <a href="https://en.wikipedia.org/wiki/Lint_(software)">linter</a> for <a href="https://getbootstrap.com">Bootstrap</a> projects</p>
      </div>
    );
  }
}
