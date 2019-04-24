import React from 'react'
import OneParameterDropdownMenu from './OneParameterDropdownMenu'
import TwoParametersDropdownMenu from './TwoParametersDropdownMenu'

export const initializeDropdown = (key, parameters, handleParametersFunction ) => {
    if(parameters.length === 2 && typeof parameters[0] === 'object') {
        return <TwoParametersDropdownMenu key = {key} parameters1={parameters[0]} parameters2={parameters[1]}
            handleParameters={handleParametersFunction} acceptFirstDropdown={false} acceptSecondDropdown={false} showFirstDropDown={"block"} />
    }
	return <OneParameterDropdownMenu key = {key} parameters={parameters} handleParameters={handleParametersFunction} acceptDropdown={false} />
}