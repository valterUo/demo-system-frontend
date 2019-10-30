# MultiCategory
## Category theory on multi-model databases

This is the frontend project for the [backend](https://github.com/valterUo/demo-system-backend-Haskell). Some part of the category theoretical background of this project is described in this unofficial draft [Some Applications of Category Theory to Multi-Model Queries](https://www.overleaf.com/read/kqvkvrhcnmxv).

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app) and it uses [D3.js](https://d3js.org/).

## How to run the code

You need to have [Node.js](https://nodejs.org/en/) installed. With Node you will get npm package manager. After cloning the source code, go to the project directory. In the directory you can run:

### `npm install`

The installation will take a while and a folder called node_modules is created. After the installation, you can start the program

### `npm start`

This runs the app in the development mode. Probably your default browser will open the front page automatically. If not, open [http://localhost:3000](http://localhost:3000) to view the frontend in the browser. The whole application needs the [backend](https://github.com/valterUo/demo-system-backend-Haskell) to work properly and its installation guide is described in its github page. <br> 

The page will reload automatically if you make edits.<br>
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.<br>
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.<br>
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br>
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

## Example query

```
LET t BE
QUERY (\x -> if customerId x == 6 then [x] else [])
ON customers
AS graph
TO relational
RETURN all
IN
LET k BE
QUERY (\x -> if any (\y -> knows x y) t then [x] else [])
ON customers
AS graph
TO relational
RETURN all
IN
QUERY (\x xs -> if creditLimit x > 1000 then x:xs else xs)
ON k
AS relational
TO relational
RETURN all
```

You can find more examples in the program.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).
