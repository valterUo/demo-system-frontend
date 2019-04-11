import React, { Component } from 'react'
import Tabs from 'react-bootstrap/Tabs'
import Tab from 'react-bootstrap/Tab'
import MultiGraph from '../dataComponents/multiGraphComponents/MultiGraph'
import MLcodeParser from '../MLcodeParser'

class CategoryComponent extends Component {
    constructor(props) {
        super(props)
        this.state = {
            categoryData: [], visible: false
        }
    }

    componentDidMount() {
        const processedData = MLcodeParser.parse(this.props.mlSchemaData.source, this.props.mlSchemaData.target)
        this.setState({
            categoryData: processedData,
            visible: true
        })
    }

    componentDidUpdate(prevProps) {
        if (JSON.stringify(this.props.mlSchemaData) !== JSON.stringify(prevProps.mlSchemaData)) {
            this.setState({ visible: false }, () => {
                const processedData = MLcodeParser.parse(this.props.mlSchemaData.source, this.props.mlSchemaData.target)
                this.setState({
                    categoryData: processedData,
                    visible: true
                })
            })

        }
    }

    render() {
        if (this.state.visible === true) {
            return <Tabs defaultActiveKey={this.state.categoryData[0].id} id="category-schema">
                {this.state.categoryData.map((morphismData, i) =>
                    <Tab key={morphismData.id} eventKey={morphismData.id} title={"Morphism level " + (i + 1)}>
                        <MultiGraph id={morphismData.id} data={morphismData.data} width={this.props.width} height={this.props.height} nodeName={"categoryNodes" + morphismData.id}
                            linkName={"categoryLinks" + morphismData.id} nameClass={"categoryGraph" + morphismData.id} editableGraph={false} />
                    </Tab>)}
            </Tabs>
        } else {
            return null
        }
    }
}
export default CategoryComponent