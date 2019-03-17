import React from 'react'

export default (props) => {

    return <div>
        <h4>Node contains: </h4>
        <p>
            {JSON.stringify(props.data)}
        </p>
    </div>
}