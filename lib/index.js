const { load_book_from_file, load_frequency_from_file } = require('./load')
const  { convert_text_to_tokens, normalize_author_name, remove_html }  = require('./parse')
const  { rank_tokens, merge_word_ranks, subtract_word_ranks } = require('./rank')
const { score } = require('./score')
module.exports = async ({ book_path, frequency_path }) => {
	if (!book_path || !frequency_path) return false
	const book_data = {
		Author: null,
		Title: null,
		Description: null,
		TotalTokens: 0,
		UniqueTokens: 0,
		FrequencyList: {},
		UnknownTokens: [],
		Score: null,
		Cover: null,
		Chapters: []
	}

	const book = await load_book_from_file(book_path)
	const frequency_list = await load_frequency_from_file(frequency_path)
	if (!book || !book.metadata) return false
	// TODO: move all book data structure into ./load.js as interface
	book_data.Author = normalize_author_name(book.metadata.creator)
	book_data.Title = book.metadata.title
	book_data.Description = book.metadata.description ? remove_html(book.metadata.description) : ''

	const uncategorized_words = []
	for (const chapter of book.flow) {
		const chapter_data = {
			FrequencyList: {},
			WordsByCategory: [],
			TotalTokens: 0,
			NewTokens: 0
		}
		try {
			const dirty_chapter_data = await book.getChapterAsync(chapter.id)
			const tokens = convert_text_to_tokens(remove_html(dirty_chapter_data))
			book_data.TotalTokens += tokens.length
			chapter_data.TotalTokens = tokens.length
			chapter_data.FrequencyList = rank_tokens(tokens)
			chapter_data.NewTokens = subtract_word_ranks(chapter_data.FrequencyList, book_data.FrequencyList).length
			chapter_data.WordsByCategory = tokens
				.reduce((categories, token) => {
					// categorize them from 5 stars to 0 stars
					const frequency_rank = frequency_list.findIndex(word => word === token)
					if (frequency_rank < 0 || frequency_rank > 100000) {
						uncategorized_words.push(token)
						categories[5] += 1
					} else {
						if (frequency_rank <= 1500) categories[0] += 1
						else if (frequency_rank <= 5000) categories[1] += 1
						else if (frequency_rank <= 15000) categories[2] += 1
						else if (frequency_rank <= 30000) categories[3] += 1
						else if (frequency_rank <= 60000) categories[4] += 1
						else categories[5] += 1
					}
					return categories
				}, [0, 0, 0, 0, 0, 0 ]) // 0-1.5k, 1.5k-5k, 5k-15k, 15k-30k, 30k-60k, 60k+
			book_data.Chapters.push(chapter_data)
			book_data.FrequencyList = merge_word_ranks([book_data.FrequencyList, chapter_data.FrequencyList])
			book_data.UnknownTokens = rank_tokens(uncategorized_words)
			book_data.UniqueTokens = Object.keys(book_data.FrequencyList).length
		} catch (err) { console.warn(err) }
	}
	// trim any "Not-Chapters"
	const chapters = book_data.Chapters
		.filter(chapter => chapter.TotalTokens)
	const average_chapter_length = chapters
		.reduce((sum, chapter) => sum + chapter.TotalTokens, 0)
		/ chapters.length
	book_data.Chapters = book_data.Chapters
		.filter(chapter => chapter.TotalTokens > (average_chapter_length * 0.10))
	book_data.Score = score(book_data)
	return book_data
}