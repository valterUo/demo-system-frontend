import React from 'react'
import Tree from 'react-d3-tree'
 
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
 
class NewTree extends React.Component {
  render() {
    const scaledwidth =  0.9 * this.props.width
    const scaledheigth = 0.6 * this.props.height
    return (
      <div id="treeWrapper" style={{width: scaledwidth, height: scaledheigth}}>
        <Tree data={this.props.treeResult} orientation = "vertical" nodeSvgShape={svgCircle} translate = {{x: scaledwidth/2, y: scaledheigth/5}} />
      </div>
    );
  }
}

export default NewTree