import axios from 'axios'

const baseUrl = 'http://localhost:8080/sql'

const getTable = async () => {
	const table = await axios.get(baseUrl)
	console.log(table)
	return table
}

export default { getTable }