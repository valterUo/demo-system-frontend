import { v4 as uuidv4 } from 'uuid'
import Notification from '../actions/NotificationAction'

export const parseTablesFromData = (listOfJSONObjects) => {
    console.log(listOfJSONObjects)
    let table = []
    let foreignTables = []
    listOfJSONObjects.map(obj => {
        let newObj = createForeignKeysToJSONObject(obj)
        if (newObj["table"] !== undefined) {
            table.push(newObj["table"])
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
        const result = combineSimpleObjectsToLargeTable(table)
        const foreignResult = combineSimpleObjectsToLargeTable(foreignTables)
        if (result !== undefined && foreignResult !== undefined) {
            return [result, foreignResult]
        }

    }
    const result = combineSimpleObjectsToLargeTable(table)
    if (result !== undefined) {
        return [result]
    }
}

const parseSimpleObjectToTable = (jsonObject) => {
    const attributes = Object.keys(jsonObject)
    const values = Object.values(jsonObject)
    return [attributes, values]
}

const combineSimpleObjectsToLargeTable = (listOfSimpleObjects) => {
    let table = []
    let hasError = false
    try {
        const attributes = Object.keys(listOfSimpleObjects[0])
        table.push(attributes)
        listOfSimpleObjects.map(simpleJSONObject => {
            const simpleTable = parseSimpleObjectToTable(simpleJSONObject)
            if (!equals(simpleTable[0], attributes)) {
                console.log("Json objects have different attributes!")
                hasError = true
            }
            table.push(simpleTable[1])
            return simpleJSONObject
        })
    } catch {
        Notification.notify("Result is empty", "warning")
        return undefined
    }
    if (hasError) {
        return undefined
    }
    return table
}

const JSONobjectHasObject = (jsonObject) => {
    let elements = Object.values(jsonObject)
    let hasObject = false
    elements.map(element => {
        if (typeof element === "object") { hasObject = true }
        return element
    })
    return hasObject
}

const createForeignKeysToJSONObject = (jsonObject) => {
    let foreignTables = []
    if (JSONobjectHasObject(jsonObject)) {
        let keys = Object.keys(jsonObject)
        keys.forEach(key => {
            if (typeof jsonObject[key] === "object") {
                const foreignKey = uuidv4();
                let newListOfObject = substituteForeignKeyToListOfJSONobjects(jsonObject[key], foreignKey)
                foreignTables.push(newListOfObject)
                jsonObject[key] = foreignKey
            }
        })
        return { "table": jsonObject, "foreignTables": foreignTables }
    } else {
        return jsonObject
    }
}

const substituteForeignKeyToListOfJSONobjects = (listOfObjects, key) => {
    try {
        listOfObjects.map(obj => {
            obj["foreignKey"] = key
            return obj
        })
        return listOfObjects
    } catch {
        return undefined
    }

}

const equals = (array1, array2) => {
    if (typeof array1 !== "object" || typeof array2 !== "object") {
        return false
    }
    if (array1.length !== array2.length) {
        return false
    }
    for (var i = 0, l = array1.length; i < l; i++) {
        if (typeof array1[i] === "object" && typeof array2[i] === "object") {
            if (!equals(array1[i], array2[i])) {
                return false
            }
        }
        else if (array1[i] !== array2[i]) {
            return false
        }
    }
    return true
}