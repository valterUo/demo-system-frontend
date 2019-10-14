import React, { Component } from 'react'
import style from '../styles'
import Row from 'react-bootstrap/Row'

class StatBox extends Component {

    render() {
        let dataBlock = <div />
        const data = this.props.data.data
        if (data[0]["key"] !== undefined && data[0]["key"] !== "") {
            dataBlock = data.map(l => <p key={l["key"]}><b>{l["key"]} : </b> {l["value"]}</p>)
        }

        return <Row style={style.basicComponentsStyle}> <div className= "col">
            <h4> Node </h4>
            <div>
                {dataBlock}
            </div>
        </div>
        </Row>
    }
}

export default StatBox