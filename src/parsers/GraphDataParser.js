export const parseJSONStringtoD3js = (jsonString) => {
    jsonString = jsonString.replace(/(\\[0-9])/g, "")
    try {
        let obj = JSON.parse(JSON.parse(jsonString))
        obj["nodes"] = obj["nodes"].map(node => {
            return JSON.parse(node)
        })
        // In some cases nodes are wrapped to Haskell Either datatype. This unwraps the wrapping.
        if (obj["nodes"][0]["Left"] !== undefined || obj["nodes"][0]["Right"] !== undefined) {
            obj["nodes"] = obj["nodes"].map(node => {
                console.log(node)
                if (node["Left"] !== undefined) {
                    return node["Left"]
                } else if (node["Right"] !== undefined) {
                    return node["Right"]
                }
                return node
            })
        }
        return obj
    } catch (err) {
        console.log("Error while parsing the JSON in Graph.")
    }
}