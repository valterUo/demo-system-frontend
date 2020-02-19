const parseChild = (childElement) => {
    let answer = {
        name: "",
        attributes: {},
        children: []
    }
    Object.keys(childElement).forEach(function (key) {
        if (Array.isArray(childElement[key])) {
            answer.name = key
            childElement[key].map(child => answer.children.push(parseChild(child)))
        } else if (hasJsonStructure(JSON.stringify(childElement[key]))) {
            answer.name = key
            answer.children.push(parseChild(childElement[key]))
        } else {
            answer.attributes[key] = childElement[key]
        }
    })
    return answer
}

export const parseJSONtoTree = (jsonDataList) => {
    let answer = {
        name: "root",
        attributes: {},
        children: []
    }
    jsonDataList.map(child => answer.children.push(parseChild(child)))
    return [answer]
}

const hasJsonStructure = (str) => {
    if (typeof str !== 'string') return false
    try {
        const result = JSON.parse(str)
        const type = Object.prototype.toString.call(result)
        return type === '[object Object]' ||
            type === '[object Array]'
    } catch (err) {
        return false
    }
}