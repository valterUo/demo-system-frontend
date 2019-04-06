import React, { Component } from 'react'

class StatBox extends Component {

    render() {
        let dataBlock = <div />
        const data = this.props.data.data
        if (data[0]["key"] !== undefined && data[0]["key"] !== "") {
            dataBlock = data.map(l => <p key={l["key"]}><b>{l["key"]} : </b> {l["value"]}</p>)
        }

        return <div className= "col">
            <h4> Node: </h4>
            <div>
                {dataBlock}
            </div>
        </div>
    }
}

export default StatBox