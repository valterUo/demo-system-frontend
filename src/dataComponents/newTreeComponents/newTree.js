import React from 'react'
import Tree from 'react-d3-tree'

// Example of tree data for the newTree Class
// const myTreeData = [
//   {
//     name: 'Top Level',
//     attributes: {
//       keyA: 'val A',
//       keyB: 'val B',
//       keyC: 'val C',
//     },
//     children: [
//       {
//         name: 'Level 2: A',
//         attributes: {
//           keyA: 'val A',
//           keyB: 'val B',
//           keyC: 'val C',
//         },
//       },
//       {
//         name: 'Level 2: B',
//       },
//     ],
//   },
// ]

const svgCircle = {
  shape: 'circle',
  shapeProps: {
    stroke: 'black',
    strokeWidth: '1',
    r: 10
  }
}

const parseChild = (childElement) => {
  let answer = {
    name: "",
    attributes: {},
    children: []
  }
  Object.keys(childElement).forEach(function (key) {
    if (Array.isArray(childElement[key])) {
      console.log(childElement[key])
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

const parseJSONtoTree = (jsonDataList) => {
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
    return type === '[object Object]'
      || type === '[object Array]'
  } catch (err) {
    return false
  }
}

class NewTree extends React.Component {

  render() {
    const scaledwidth = 0.9 * this.props.width
    const scaledheigth = 0.6 * this.props.height
    const result = parseJSONtoTree(this.props.treeResult)
    return (
      <div id="treeWrapper" style={{ width: scaledwidth, height: scaledheigth }}>
        <Tree data={result} orientation="vertical" nodeSvgShape={svgCircle} translate={{ x: scaledwidth / 2, y: scaledheigth / 5 }} />
      </div>
    );
  }
}

export default NewTree