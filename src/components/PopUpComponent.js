import React from 'react'
import Button from 'react-bootstrap/Button'
import style from '../styles'

class PopUpComponent extends React.Component {
    render() {
        return (
            <div style={style.popup}>
                <div style={style.popupInner}>
                    <div style={style.infoTextStyle}>

                        <h1>MultiCategory Demo System</h1>

                        <p>You can enter a query to the input field. There is a list of example queries behind the "Select example query" dropdown menu.
                        Please note the following restrictions when entering a query.</p>

                        <ul>
                            <li>Each query must contain parts QUERY, FROM, AS, TO and RETURN in this order.</li>
                            <li>Typed collections have names <i>customers</i> (graph data), <i>orders</i> (tree structured data) and <i>locations</i> (relational data).</li>
                            <li>LET BE IN -clause is optional.</li>
                            <li>At the moment queries support three data models: relational, tree and graph. After AS and TO user must write exactly one of these.</li>
                            <li>If user is querying data to graph model, then the function in QUERY line must have exactly one variable (i.e. \x -> ...)</li>
                            <li>If user is querying any other model, then the function in QUERY line must have exactly two variables (i.e. \x xs -> ...) where the second variable refers
                            to the structure where the variable x is inserted.</li>
                        </ul>

                        <p> You can use the schema category to see attributes' names, data model and other information about the data.</p>

                        <p>You can find more information about the theoretical background of the system <a href="https://www.overleaf.com/read/kqvkvrhcnmxv">here</a>.</p>

                        <p> Have fun and thanks for the interest!</p>
                        <Button variant="dark" onClick={this.props.closePopup}>Close</Button>
                    </div>
                </div>
            </div>
        )
    }
}

export default PopUpComponent;