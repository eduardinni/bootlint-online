import React, { Component } from 'react';
import {
  Col,
} from 'react-bootstrap';
import MsgError from './MsgError';
import MsgNoLints from './MsgNoLints';
import Lints from './Lints';

export default class BootlintForm extends Component {
  render(){
    return (
      <Col md={12}>
        { this.props.errorMsg ? <MsgError errorMsg={this.props.errorMsg} /> : null }
        { this.props.showNoLintsMsg ? <MsgNoLints /> : null }
        { this.props.lints.length > 0 ? <Lints lints={this.props.lints} /> : null }
      </Col>
    );
  }
}
