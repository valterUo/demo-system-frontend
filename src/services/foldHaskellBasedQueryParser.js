/* eslint-disable array-callback-return */
import haskellCompiler from '../services/haskellCompilerService'
import sourceModels from "./collectionDataTypesForDatasets.json"

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
        if (mainQuery !== undefined && mainQuery !== "Error!") {
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
        .split("@")
    queryElements.shift()
    queryElements = queryElements.map(element => element.trim())
    if (3 === queryElements.length === 4) {
        return {
            "model": "error",
            "message": "Error! Wrong amount of arguments in the query."
        }
    }
    if (queryElements[0][0] !== "(" || queryElements[0][queryElements[0].length - 1] !== ")") {
        return {
            "model": "error",
            "message": "Error! The lambda function (defined in QUERY line) needs to be in paranthesis."
        }
    }
    let i = 0
    if(queryElements.length === 4) {
        i = 1
    }
    //console.log(queryElements)
    let lambdafunction = queryElements[0]
    const dataset = queryElements[1]
    let sourceModel = sourceModels[dataset]
    if(sourceModel === undefined) {
        sourceModel = queryElements[2]
    }
    //console.log(sourceModel)
    switch (sourceModel) {
        case "relational":
        case "xml":
        case "json":
            haskellQuery.push("foldr ")
            switch (queryElements[2 + i]) {
                case "relational":
                case "xml":
                case "json":
                    haskellQuery.push(lambdafunction)
                    haskellQuery.push(" [] ")
                    haskellQuery.push(dataset)
                    break
                case "graph":
                    haskellQuery.push(lambdafunction)
                    haskellQuery.push(" Algebra.Graph.empty ")
                    haskellQuery.push(dataset)
                    break
                case "rdf":
                    haskellQuery.push(lambdafunction)
                    haskellQuery.push(" RDF.empty ")
                    haskellQuery.push(dataset + " :: RDF TList")
                    break
                case "nimblegraph":
                    haskellQuery.push(lambdafunction)
                    haskellQuery.push(" emptyNimbleGraph ")
                    haskellQuery.push(dataset)
                    break
                default:
                    return "Error!"
            }
            break
        case "graph":
            haskellQuery.push("foldg ")
            lambdafunction = lambdafunction.replace("empty", "Algebra.Graph.empty")
            switch (queryElements[2 + i]) {
                case "relational":
                case "xml":
                case "json":
                    haskellQuery.push(" [] ")
                    haskellQuery.push(lambdafunction)
                    haskellQuery.push(" (union) ")
                    haskellQuery.push("(union) ")
                    haskellQuery.push(dataset)
                    break
                case "graph":
                    haskellQuery.push("Algebra.Graph.empty ")
                    haskellQuery.push(lambdafunction)
                    haskellQuery.push(" overlay ")
                    haskellQuery.push("connect ")
                    haskellQuery.push(dataset)
                    break
                case "rdf":
                    haskellQuery.push(" RDF.empty ")
                    haskellQuery.push(lambdafunction)
                    haskellQuery.push(" rdfUnion ")
                    haskellQuery.push("rdfUnion ")
                    haskellQuery.push(dataset + " :: RDF TList")
                    break
                case "nimblegraph":
                    haskellQuery.push(" emptyNimbleGraph ")
                    haskellQuery.push(lambdafunction)
                    haskellQuery.push(" nimbleGraphUnion ")
                    haskellQuery.push("nimbleGraphUnion ")
                    haskellQuery.push(dataset)
                    break
                default:
                    return "Error!"
            }
            break
        case "rdf":
            haskellQuery.push("(foldrdf ")
            switch (queryElements[2 + i]) {
                case "relational":
                case "xml":
                case "json":
                    haskellQuery.push(lambdafunction)
                    haskellQuery.push(" [] ")
                    haskellQuery.push(dataset + ")")
                    break
                case "graph":
                    haskellQuery.push("Algebra.Graph.empty ")
                    haskellQuery.push(lambdafunction)
                    haskellQuery.push(" overlay ")
                    haskellQuery.push("connect ")
                    haskellQuery.push(dataset + ")")
                    break
                case "rdf":
                    haskellQuery.push(lambdafunction)
                    haskellQuery.push(" RDF.empty ")
                    haskellQuery.push(dataset + " :: RDF TList)")
                    break
                default:
                    return "Error!"
            }
            break
        case "nimblegraph":
            haskellQuery.push("foldNimble ")
            switch (queryElements[2 + i]) {
                case "relational":
                case "xml":
                case "json":
                    haskellQuery.push(" [] ")
                    haskellQuery.push(lambdafunction)
                    haskellQuery.push(" (union) ")
                    haskellQuery.push("(union) ")
                    haskellQuery.push(dataset)
                    break
                case "graph":
                    haskellQuery.push("Algebra.Graph.empty ")
                    haskellQuery.push(lambdafunction)
                    haskellQuery.push(" overlay ")
                    haskellQuery.push("connect ")
                    haskellQuery.push(lambdafunction)
                    break
                case "rdf":
                    haskellQuery.push(lambdafunction)
                    haskellQuery.push(" RDF.empty ")
                    haskellQuery.push(dataset + " :: RDF TList")
                    break
                case "nimblegraph":
                    haskellQuery.push(lambdafunction)
                    haskellQuery.push(" (\\edge newGraph -> case (Map.lookup (vertexId $ NimbleGraph.NimbleGraph.source edge) (NimbleGraph.NimbleGraph.vertices newGraph)) of Nothing -> newGraph; Just(sourceVertex) -> case Map.lookup (vertexId $ NimbleGraph.NimbleGraph.target edge) (NimbleGraph.NimbleGraph.vertices newGraph) of Nothing -> newGraph; Just(targetVertex) -> addEdge edge newGraph) emptyNimbleGraph ")
                    haskellQuery.push(dataset)
                    break
                default:
                    return "Error! Target model did not match any model."
            }
            break
        default:
            return {
                "model": "error", "message": "Error! Data model (AS line in the query) did not mathc any data model."
            }
    }
    return {
        "model": queryElements[2 + i],
        "query": haskellQuery.join("")
    }
}

const getTheQuery = (inputQuery) => {
    const parsedQueryList = parseLetInQueryBlock(inputQuery)
    if (parsedQueryList === undefined) {
        return {
            "model": "error",
            "message": "The query is not valid."
        }
    } else {
        const model = parsedQueryList["model"]
        const query = parsedQueryList["query"]
        console.log(query)
        return { "model": model, "query": query }
    }
}

const executeQuery = async (model, query) => {
        switch (model) {
            case "graph":
                return {
                "model": model,
                "answer": await haskellCompiler.compileGraphQuery(query),
                "fold": query
                }
            case "relational":
                return {
                "model": model,
                "answer": await haskellCompiler.compileRelationalQuery(query),
                "fold": query
                }
            case "xml":
                return {
                    "model": model,
                    "answer": await haskellCompiler.compileTreeQuery(query),
                    "fold": query
                }
            case "rdf":
                return {
                    "model": "graph",
                    "answer": await haskellCompiler.compileRDFGraphQuery(query),
                    "fold": query
                }
            case "json":
                return {
                    "model": "xml",
                    "answer": await haskellCompiler.compileTreeQuery(query),
                    "fold": query
                }
            case "nimblegraph":
                return {
                    "model": "graph",
                    "answer": await haskellCompiler.compileNimbleGraphQuery(query),
                    "fold": query
                }
            default:
                return {
                    "model": "error",
                    "message": "Unexpected error happened. No model was found.",
                    "fold": query
                }
        }
}

export default {
    executeQuery,
    parseLetInQueryBlock,
    getTheQuery
}