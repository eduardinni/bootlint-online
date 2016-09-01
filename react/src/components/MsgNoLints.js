import React, { Component } from 'react';

export default class MsgNoLints extends Component {
  render(){
    return (
      <div className="alert alert-success" role="alert"><strong>Cool,</strong> no Bootstrap lint problems with your code.</div>
    );
  }
}
