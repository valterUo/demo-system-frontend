import React, { Component } from 'react'
import Navbar from 'react-bootstrap/Navbar'
import style from './styles'
import githubimage from './GitHub-Mark-64px.png'

class NavigationBarComponent extends Component {

    render() {
        return <Navbar style={style.headerBackGroundColorStyle} variant="light" expand="lg">
            <Navbar.Brand href="#home"><h3>Category Theory in Multi-model Databases</h3></Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse className="justify-content-end">
                <a href="https://www.helsinki.fi/en/researchgroups/unified-database-management-systems-udbms"> UDBMS </a>
                <div>&nbsp; &nbsp;</div>
                <a href="https://github.com/enorvio/demo-system">
                    <img width="30" height="30" src={githubimage} alt="githublogo" />
                </a>
            </Navbar.Collapse>
        </Navbar>
    }
}
export default NavigationBarComponent