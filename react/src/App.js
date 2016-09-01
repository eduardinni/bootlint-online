import React, { Component } from 'react';
import './App.css';
import {
  Grid,
} from 'react-bootstrap';
import PageHeader from './components/PageHeader';
import BootlintForm from './components/BootlintForm';
import PageInfo from './components/PageInfo';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      urlParam: '',
    };
  }

  componentWillMount() {
    this.setState({
      urlParam: this.getParam('url')
    })
  }

  getParam(param) {
    var url = window.location.href;
    param = param.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + param + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
  }

  render() {
    return (
      <Grid>
        <PageHeader />
        <BootlintForm urlParam={this.state.urlParam} />
        <PageInfo />
        <div className="footer text-center">
          <p><a href="https://github.com/eduardinni/bootlint-online">Bootlint Online</a> powered by <a href="https://github.com/twbs/bootlint">Bootlint</a></p>
        </div>
      </Grid>
    );
  }
}

export default App;
