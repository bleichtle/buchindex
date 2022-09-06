const EPub = require('epub2').EPub
const fs = require('fs')

const load_book_from_file = async (path) => {
	try {
		return await EPub.createAsync(path)
	} catch (err) {
		console.warn(err)
		return false
	}
}

const load_frequency_from_file = async (path) => {
	// for now only support word rank format (word,occurences)
	try {
		const file_data = fs.readFileSync(path, 'utf8')
		return file_data
			.split('\n')
			.map(row => row.split(',')[0])
	} catch (err) {
		console.warn(err)
		return false
	}
}

module.exports = {
	load_book_from_file,
	load_frequency_from_file
}