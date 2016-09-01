import React, { Component } from 'react';
import {
  Col,
  Row,
} from 'react-bootstrap';

export default class PageInfo extends Component {
  render(){
    return (
      <Row bsClass="row row-info">
        <Col md={6}>
          <h4>{"What's Bootlint?"}</h4>
          <p>Checks for several common HTML mistakes in webpages that are using Bootstrap in a fairly "vanilla" way. Vanilla Bootstrap's components/widgets require their parts of the DOM to conform to certain structures. Bootlint checks that instances of Bootstrap components have correctly-structured HTML. Optimal usage of Bootstrap also requires that your pages include certain <code>&lt;meta&gt;</code> tags, an HTML5 doctype declaration, etc.; Bootlint checks that these are present.</p>
          <h4>{"What's Bootlint Online?"}</h4>
          <p>An implementation of <a href="https://github.com/twbs/bootlint">Bootlint</a> tool to check remote websites.</p>
          <p>This site is NOT operated by Bootstrap Team.</p>
          <p>You can contribute to <a href="https://github.com/eduardinni/bootlint-online">Bootlint Online on Github</a>.</p>
          <p>
            <a href="https://david-dm.org/eduardinni/bootlint-online">
              <img src="https://david-dm.org/eduardinni/bootlint-online.svg" alt="Dependency Status" className="img-devstatus" />
            </a>
            <iframe src="http://ghbtns.com/github-btn.html?user=eduardinni&repo=bootlint-online&type=watch&count=true"
              allowTransparency="true" frameBorder="0" scrolling="0" width="115" height="20"></iframe>
          </p>
        </Col>
        <Col md={6}>
          <h4>Caveats</h4>
          <p>Bootlint assumes that your webpage is already valid HTML5. Use another tool, such as the <a href="http://validator.w3.org/">W3C validator</a>, to check that first. </p>
          <p>{"Bootlint assumes that you are using Bootstrap's default class names in your webpage, as opposed to taking advantage of the \"mixins\" functionality of Less or Sass to map them to custom class names. If you are using mixins, Bootlint may report some false-positive warnings. However, there are some Bootlint checks that are applicable even if you are using mixins pervasively."}</p>
          <h4>Using querystring</h4>
          <p>Validates given URL and triggers bootlint check up.</p>
          <pre>
            http://www.bootlint.com/?url=<span className="code-var">&lt;url_to_check&gt;</span>
          </pre>
        </Col>
      </Row>
    );
  }
}
