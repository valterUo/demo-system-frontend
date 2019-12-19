module.exports = `<div class='categoricalViewToQuery'>
<h1>Categorical view to the query</h1>
<p>This menu toggles the categorical view to the query. This property does not yet work as well as possible because of the huge variety of different kind of queries.</p>
<p>For obtaining better understanding of the category theoretical structure behind the queries, MultiCategory provides an automatic visualizer for queries. 
This feature visualizes queries as graphs with respect to the schema category. 
Each query can be considered as a subgraph of the schema category so that each block starting with QUERY-clause starts a path in the schema category. 
This means that each node of the resulting graph is a datatype and each edge is a Haskell function between two datatypes. 
Eventually the composition of the functions represents the whole query. 
The definition of a category ensures, that the composition is always well-defined and it exists.</p>
</div>`