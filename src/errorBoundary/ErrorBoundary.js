import React, { Component } from 'react'
import Row from 'react-bootstrap/Row'
import style from '../styles'

class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true }
  }

  componentDidCatch(error, errorInfo) {
    // You can also log the error to an error reporting service
    //logErrorToMyService(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <Row style={style.basicComponentsStyle}> <div className="col">
        <h4> Contents </h4>
        <div>
          <p><b>value:</b> error to express the data </p>
        </div>
      </div>
      </Row>
    }

    return this.props.children
  }
}

export default ErrorBoundary