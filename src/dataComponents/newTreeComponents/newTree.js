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
    const scaledwith = 0.44 * this.props.width
    const scaledheight = 0.44 * this.props.height
    return (
      <div id="treeWrapper" style={{width: scaledwith, height: scaledheight}}>
        <Tree data={this.props.treeResult} orientation = "vertical" nodeSvgShape={svgCircle} translate = {{x: scaledwith/2, y: scaledheight/5}} />
      </div>
    );
  }
}

export default NewTree