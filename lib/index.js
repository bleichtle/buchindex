const { load_book_from_file } = require('./load')
const  { convert_text_to_tokens, normalize_author_name, remove_html }  = require('./parse')
const  { rank_tokens, merge_word_ranks, subtract_word_ranks } = require('./rank')

module.exports = async ({ book_path, frequency_path }) => {
	if (!book_path || !frequency_path) return false
	const book_data = {
		Author: null,
		Title: null,
		Description: null,
		TotalTokens: 0,
		UniqueTokens: 0,
		FrequencyList: {},
		Score: null,
		Cover: null,
		Chapters: []
	}

	const book = await load_book_from_file(book_path)
	if (!book || !book.metadata) return false
	// TODO: move all book data structure into ./load.js as interface
	book_data.Author = normalize_author_name(book.metadata.creator)
	book_data.Title = book.metadata.title
	book_data.Description = remove_html(book.metadata.description)

	for (const chapter of book.flow) {
		const chapter_data = {
			FrequencyList: {},
			WordsByCategory: [],
			TotalTokens: 0,
			NewTokens: 0
		}
		const dirty_chapter_data = await book.getChapterAsync(chapter.id)
		const tokens = convert_text_to_tokens(remove_html(dirty_chapter_data))
		book_data.TotalTokens += tokens.length
		chapter_data.TotalTokens = tokens.length
		chapter_data.FrequencyList = rank_tokens(tokens)
		chapter_data.NewTokens = subtract_word_ranks(chapter_data.FrequencyList, book_data.FrequencyList).length
		book_data.Chapters.push(chapter_data)
		book_data.FrequencyList = merge_word_ranks([book_data.FrequencyList, chapter_data.FrequencyList])
	}
	
	return book_data
}