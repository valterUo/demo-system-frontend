/* eslint-disable array-callback-return */
import haskellCompiler from '../services/haskellCompilerService'

const parseLetInQueryBlock = (inputString) => {
    if (inputString.includes("LET")) {
        let subQueries = inputString.split("\n")
            .join("")
            .split("LET")
            .join("@")
            .split("BE")
            .join("@")
            .split("IN")
            .join("@IN@")
            .split("@")
        subQueries.shift()
        let mainQuery
        let parsedSubQueries = ""
        subQueries.map((query, i) => {
            if (query.includes("QUERY") && subQueries[i - 1] !== "IN") {
                let parsed = parseMainQueryBlock(query)
                if (parsed["model"] === "error") {
                    console.log("error", parsed["message"])
                    return parsed["message"]
                } else {
                    parsedSubQueries += "let " + subQueries[i - 1] + " = " + parsed["query"] + " in "
                }
            } else if (query.includes("QUERY") && subQueries[i - 1] === "IN") {
                mainQuery = parseMainQueryBlock(query)
            }
            return query
        })
        if(mainQuery !== undefined && mainQuery !== "Error!") {
            mainQuery["query"] = parsedSubQueries + mainQuery["query"]
        return mainQuery
        }
    } else {
        return parseMainQueryBlock(inputString)
    }
}

const parseMainQueryBlock = (inputString) => {
    let haskellQuery = []
    let queryElements = inputString.split("\n")
        .join("")
        .split("QUERY")
        .join("@")
        .split("TO")
        .join("@")
        .split("AS")
        .join("@")
        .split("FROM")
        .join("@")
        .split("RETURN")
        .join("@")
        .split("@")
    queryElements.shift()
    queryElements = queryElements.map(element => element.trim())
    if (queryElements.length !== 5) {
        return {
            "model": "error",
            "message": "Error! Wrong amount of arguments in the query."
        }
    }
    if (queryElements[0][0] !== "(" || queryElements[0][queryElements[0].length - 1] !== ")") {
        return {
            "model": "error",
            "message": "Error! The function (defined in QUERY line) needs to be in paranthesis."
        }
    }
    console.log(queryElements)
    switch (queryElements[2]) {
        case "relational":
        case "tree":
        case "json":
            haskellQuery.push("foldr ")
            switch (queryElements[3]) {
                case "relational":
                case "tree":
                case "json":
                    haskellQuery.push(queryElements[0])
                    haskellQuery.push(" [] ")
                    haskellQuery.push(queryElements[1])
                    break
                case "graph":
                    haskellQuery.push(queryElements[0])
                    haskellQuery.push(" Algebra.Graph.empty ")
                    haskellQuery.push(queryElements[1])
                    break
                default:
                    return "Error!"
            }
            break
        case "graph":
            haskellQuery.push("foldg ")
            switch (queryElements[3]) {
                case "relational":
                case "tree":
                case "json":
                    haskellQuery.push(" [] ")
                    haskellQuery.push(queryElements[0])
                    haskellQuery.push(" (union) ")
                    haskellQuery.push("(union) ")
                    haskellQuery.push(queryElements[1])
                    break
                case "graph":
                    haskellQuery.push("Algebra.Graph.empty ")
                    haskellQuery.push(queryElements[0])
                    haskellQuery.push(" overlay ")
                    haskellQuery.push("connect ")
                    haskellQuery.push(queryElements[1])
                    break
                default:
                    return "Error!"
            }
            break
        case "rdf":
            haskellQuery.push("(foldrdf ")
            switch (queryElements[3]) {
                case "relational":
                case "tree":
                case "json":
                    haskellQuery.push(" [] ")
                    haskellQuery.push(queryElements[0])
                    haskellQuery.push(" (union) ")
                    haskellQuery.push("(union) ")
                    haskellQuery.push(queryElements[1])
                    break
                case "graph":
                    haskellQuery.push("Algebra.Graph.empty ")
                    haskellQuery.push(queryElements[0])
                    haskellQuery.push(" overlay ")
                    haskellQuery.push("connect ")
                    haskellQuery.push(queryElements[1])
                    break
                case "rdf":
                    haskellQuery.push(queryElements[0])
                    haskellQuery.push(" RDF.empty ")
                    haskellQuery.push(queryElements[1] + " :: RDF TList)")
                    break
                default:
                    return "Error!"
            }
            break
        default:
            return {
                "model": "error", "message": "Error! Data model (AS line in the query) did not mathc any data model."
            }
    }

    return {
        "model": queryElements[3],
        "query": haskellQuery.join("")
    }
}

const executeQuery = async (inputQuery) => {
    const parsedQueryList = parseLetInQueryBlock(inputQuery)
    if(parsedQueryList === undefined) {
        return {
            "model": "error",
            "message": "The query is not valid."
        }
    } else {
    const model = parsedQueryList["model"]
    const query = parsedQueryList["query"]
    console.log(query)
    if (model === "graph") {
        return {
            "model": model,
            "answer": await haskellCompiler.compileGraphQuery(query)
        }
    } else if (model === "relational") {
        return {
            "model": model,
            "answer": await haskellCompiler.compileRelationalQuery(query)
        }
    } else if (model === "tree") {
        return {
            "model": model,
            "answer": await haskellCompiler.compileTreeQuery(query)
        }
    } else if(model === "rdf") {
        return {
            "model": "graph",
            "answer": await haskellCompiler.compileRDFGraphQuery(query)
        }
    } else if(model === "json") {
        return {
            "model": "relational",
            "answer": await haskellCompiler.compileRelationalQuery(query)
        }
    } else if (model === "error") {
        return parsedQueryList
    } else {
        return {
            "model": "error",
            "message": "Unexpected error happened. No model was found."
        }
    }
}
}

export default {
    executeQuery,
    parseLetInQueryBlock
}