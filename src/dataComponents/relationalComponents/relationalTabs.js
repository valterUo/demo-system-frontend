import React, { Component } from 'react'
import Tabs from 'react-bootstrap/Tabs'
import Tab from 'react-bootstrap/Tab'
import RelationalComponent from './relationalComponent'
import { v4 as uuidv4 } from 'uuid'

class RelationalTabs extends Component {

    parseTablesFromData(listOfJSONObjects) {
        console.log(listOfJSONObjects)
        let table = []
        let foreignTables = []
        listOfJSONObjects.map(obj => {
            console.log(obj)
            let newObj = this.createForeignKeysToJSONObject(obj)
            console.log(newObj)
            if (newObj["table"] !== undefined) {
                table.push(newObj["table"])
                console.log(newObj)
                newObj["foreignTables"].map(tables => {
                    tables.map(table => {
                        foreignTables.push(table)
                        return table
                    })
                    return tables
                })
                console.log(foreignTables)
            } else {
                table.push(obj)
            }
            return obj
        })
        if (foreignTables.length > 0) {
            return [this.combineSimpleObjectsToLargeTable(table), this.combineSimpleObjectsToLargeTable(foreignTables)]
        }
        return [this.combineSimpleObjectsToLargeTable(table)]

    }

    parseSimpleObjectToTable(jsonObject) {
        const attributes = Object.keys(jsonObject)
        const values = Object.values(jsonObject)
        return [attributes, values]
    }

    combineSimpleObjectsToLargeTable(listOfSimpleObjects) {
        let table = []
        const attributes = Object.keys(listOfSimpleObjects[0])
        table.push(attributes)
        let hasError = false
        listOfSimpleObjects.map(simpleJSONObject => {
            const simpleTable = this.parseSimpleObjectToTable(simpleJSONObject)
            if (!this.equals(simpleTable[0], attributes)) {
                console.log("Json objects have different attributes!")
                hasError = true
            }
            table.push(simpleTable[1])
            return simpleJSONObject
        })
        if (hasError) {
            return undefined
        }
        return table
    }

    JSONobjectHasObject(jsonObject) {
        let elements = Object.values(jsonObject)
        let hasObject = false
        elements.map(element => {
            if (typeof element === "object") { hasObject = true }
            return element
        })
        return hasObject
    }

    createForeignKeysToJSONObject(jsonObject) {
        let foreignTables = []
        if (this.JSONobjectHasObject(jsonObject)) {
            let keys = Object.keys(jsonObject)
            keys.forEach(key => {
                if (typeof jsonObject[key] === "object") {
                    const foreignKey = uuidv4();
                    let newListOfObject = this.substituteForeignKeyToListOfJSONobjects(jsonObject[key], foreignKey)
                    foreignTables.push(newListOfObject)
                    jsonObject[key] = foreignKey
                }
            })
            return { "table": jsonObject, "foreignTables": foreignTables }
        } else {
            return jsonObject
        }

    }

    substituteForeignKeyToListOfJSONobjects(listOfObjects, key) {
        listOfObjects.map(obj => {
            obj["foreignKey"] = key
            return obj
        })
        return listOfObjects
    }

    equals = (array1, array2) => {
        if (typeof array1 !== "object" || typeof array2 !== "object") {
            return false
        }
        if (array1.length !== array2.length) {
            return false
        }
        for (var i = 0, l = this.length; i < l; i++) {
            if (typeof array1[i] === "object" && typeof array2[i] === "object") {
                if (!this.equals(array1[i], array2[i])) {
                    return false
                }
            }
            else if (array1[i] !== array2[i]) {
                return false
            }
        }
        return true
    }

    render() {
        console.log(this.props.data)
        if (this.props.data === undefined) {
            return null
        } else {
            const result = this.parseTablesFromData(this.props.data)
            console.log(result)
            return <Tabs defaultActiveKey={JSON.stringify(result[0][0])} id="uncontrolled-tab-relational-result">
                {result.map(table => <Tab key={JSON.stringify(table[0])} eventKey={JSON.stringify(table[0])} title={"Result"}>
                    <RelationalComponent width={this.props.width} height={this.props.height} key={JSON.stringify(table[0])} data={table} />
                </Tab>)}
            </Tabs>
        }
    }
}

export default RelationalTabs