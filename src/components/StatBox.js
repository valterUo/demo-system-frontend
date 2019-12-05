import React, { Component } from 'react'
import style from '../styles'
import Row from 'react-bootstrap/Row'

class StatBox extends Component {

    render() {
        let dataBlock = <div />
        const data = this.props.data.data
        if (data[0]["key"] !== undefined && data[0]["key"] !== "") {
            try {
                dataBlock = data.map(l => <p key={l["key"]}><b>{l["key"]} : </b> {l["value"]}</p>)
            } catch {
                try {
                dataBlock = <p><b>value:</b> {JSON.stringify(data)} </p>
                } catch {
                    dataBlock = <p><b>value:</b> error to express the data </p>
                }
            }
            
        }
        let header = "Contents"
        if(this.props.data.header !== undefined) {
            header = this.props.data.header
        }
            

        return <Row style={style.basicComponentsStyle}> <div className= "col">
            <h4> { header } </h4>
            <div>
                {dataBlock}
            </div>
        </div>
        </Row>
    }
}

export default StatBox