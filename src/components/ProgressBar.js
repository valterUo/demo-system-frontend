import React, { Component } from 'react'
import styles from '../styles'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'

class ProgressBar extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  render() {
    return (
      <Col>
        <Row>
          <div className="ProgressBar" style={styles.progressBar}>
            <div
              className="Progress"
              style={{
                backgroundColor: "#616161",
                height: "100%",
                margin: "0",
                borderRadius: "5px",
                width: this.props.progress + '%'
              }}
            />
          </div>
        </Row>
        <Row>
          {this.props.progress + "%"}
        </Row>
      </Col>
    )
  }
}

export default ProgressBar