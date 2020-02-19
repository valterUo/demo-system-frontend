import { v4 as uuidv4 } from 'uuid'

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
        return [combineSimpleObjectsToLargeTable(table), combineSimpleObjectsToLargeTable(foreignTables)]
    }
    return [combineSimpleObjectsToLargeTable(table)]

}

const parseSimpleObjectToTable = (jsonObject) => {
    const attributes = Object.keys(jsonObject)
    const values = Object.values(jsonObject)
    return [attributes, values]
}

const combineSimpleObjectsToLargeTable = (listOfSimpleObjects) => {
    let table = []
    const attributes = Object.keys(listOfSimpleObjects[0])
    table.push(attributes)
    let hasError = false
    listOfSimpleObjects.map(simpleJSONObject => {
        const simpleTable = parseSimpleObjectToTable(simpleJSONObject)
        if (!equals(simpleTable[0], attributes)) {
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
    listOfObjects.map(obj => {
        obj["foreignKey"] = key
        return obj
    })
    return listOfObjects
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