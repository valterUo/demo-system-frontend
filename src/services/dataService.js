import axios from 'axios'

const getData = async (type) => {
	const data = await axios.get('/' + type)
	return data
}

export default { getData }