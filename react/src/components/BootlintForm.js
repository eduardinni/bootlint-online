import React, { Component } from 'react';
import {
  Col,
  Row,
  Tabs,
  Tab,
  Well,
} from 'react-bootstrap';
import classNames from 'classnames';
import MsgErrorUrl from './MsgErrorUrl';
import BootlintResults from './BootlintResults';

export default class BootlintForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      urlParam: this.props.urlParam || '',
      inputParam: '',
      urlInvalid: false,
      loading: false,
      checkBtnClass: '',
      errorMsg: '',
      showNoLintsMsg: false,
      lints: [],
    };
    this.handleInputUrl    = this.handleInputUrl.bind(this);
    this.handleDirectInput = this.handleDirectInput.bind(this);
    this.handleFormByURL   = this.handleFormByURL.bind(this);
    this.handleFormByInput = this.handleFormByInput.bind(this);
  }

  componentDidMount() {
    if(this.props.urlParam) {
      this.runBootlintByURL();
    }
  }

  handleInputUrl(event) {
    this.setState({urlParam: event.target.value});
  }

  handleDirectInput(event) {
    this.setState({inputParam: event.target.value});
  }

  handleFormByURL(event) {
    event.preventDefault();
    this.runBootlintByURL();
  }

  handleFormByInput(event) {
    event.preventDefault();
    this.runBootlint('code', this.state.inputParam);
  }

  runBootlintByURL() {
    var urlRegex = new RegExp(/[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/gi);
    if(this.state.urlParam.match(urlRegex)) {
      this.runBootlint('url', this.state.urlParam);
    }
    else {
      this.setState({urlInvalid: true});
    }
  }

  runBootlint(checkby, data) {
    this.setState({
      loading: true,
      errorMsg: '',
      showNoLintsMsg: false,
      lints: [],
    });

    fetch('http://bootlint-online.api.bootlint.com/check', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          checkby: checkby,
          data: data,
        })
      })
      .then(response => {
        return response.json();
      })
      .then(json => {
        this.setState({
          loading: false,
          errorMsg: json.error || '',
          showNoLintsMsg: json.lints.length === 0,
          lints: json.lints,
        });
      })
      .catch((err) => {
        this.setState({
          loading: false,
          errorMsg: "there is a problem with the API, please check again later."
        });
      });
  }

  render(){
    var btnClass = classNames({
      'btn btn-primary btn-lg btn-submit': true,
      'btn-loading': this.state.loading,
    });
    return (
      <Row>
        <Col md={12}>
          <Well>
            <p className="lead">Search for Bootstrap problems</p>
            <div>
              <Tabs defaultActiveKey={1} id="bootlint-tabs">
                <Tab eventKey={1} title="by URL">
                  <form className="form" onSubmit={this.handleFormByURL}>
                    <div className="form-group form-group-input">
                      <label className="sr-only" htmlFor="formUrlParam">URL</label>
                      <input className="form-control" type="url" name="urlParam" id="formUrlParam"
                          placeholder="http://www.yoursite.com"
                          value={this.state.urlParam} onChange={this.handleInputUrl} required />
                    </div>
                    <div className="text-center">
                      <button type="submit" className={btnClass} disabled={this.state.loading}>Check</button>
                      { this.state.urlInvalid ? <MsgErrorUrl /> : null }
                    </div>
                  </form>
                </Tab>
                <Tab eventKey={2} title="by Direct Input">
                  <form className="form" onSubmit={this.handleFormByInput}>
                    <div className="form-group form-group-input">
                      <textarea className="form-control" rows="7"
                        placeholder="Paste a complete HTML document here"
                        value={this.state.inputParam} onChange={this.handleDirectInput} required></textarea>
                    </div>
                    <div className="text-center">
                      <button type="submit" className={btnClass} disabled={this.state.loading}>Check</button>
                    </div>
                  </form>
                </Tab>
              </Tabs>
            </div>
          </Well>
        </Col>
        <BootlintResults errorMsg={this.state.errorMsg} showNoLintsMsg={this.state.showNoLintsMsg} lints={this.state.lints} />
      </Row>
    );
  }
}
