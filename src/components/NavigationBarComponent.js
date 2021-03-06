import React, { Component } from 'react'
import Navbar from 'react-bootstrap/Navbar'
import style from '../styles'
import githubimage from '../GitHub-Mark-64px.png'
import udbmsLogo from '../UDBMSTransparentLogo.png'

class NavigationBarComponent extends Component {

    render() {
        return <Navbar style={style.headerBackGroundColorStyle} variant="light" expand="lg">
            <Navbar.Brand href="#home"><h3>MultiCategory: Category Theory in Multi-model Databases</h3></Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse className="justify-content-end">
                <a href="https://www.helsinki.fi/en/researchgroups/unified-database-management-systems-udbms"> UDBMS &nbsp; <img width="40" height="40" src={udbmsLogo} alt="udbmsLogo" /> </a>
                <div>&nbsp; &nbsp;</div>
                <a href="https://github.com/valterUo/demo-system-backend-Haskell">
                    <img width="30" height="30" src={githubimage} alt="githublogo" />
                </a>
            </Navbar.Collapse>
        </Navbar>
    }
}
export default NavigationBarComponent