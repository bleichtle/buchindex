const EPub = require('epub2').EPub

const load_book_from_file = async (path) => {
	try {
		return await EPub.createAsync(path)
	} catch (err) {
		console.warn(err)
		return false
	}
}

module.exports = {
	load_book_from_file
}