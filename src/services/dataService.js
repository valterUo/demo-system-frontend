import axios from 'axios'

const getData = async (type) => {
	const data = await axios.get('http://localhost:8080/' + type)
	return data
}

export default { getData }