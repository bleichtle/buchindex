
(async function () {
	const buchindex = require('./lib/index')

	const data = await buchindex({
		book_path: './All the Young Dudes.epub',
		frequency_path: true
	})

	console.log(data)
}())