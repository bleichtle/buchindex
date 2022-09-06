const rank_tokens = (tokens) => {
	return tokens
		.reduce((dict, token) => {
			dict[token] = ( dict[token] || 0 ) + 1
			return dict
		}, {})
}

const merge_word_ranks = (word_ranks) => {
	const merged = {}
	word_ranks
		.forEach(word_rank => {
			Object.keys(word_rank)
				.forEach(token => 
					merged[token] = word_rank[token] + (merged[token] || 0)
				)
		})
	return merged
}

const subtract_word_ranks = (subtractee, subtractor) => {
	const subtractee_words = Object.keys(subtractee)
	const subtractor_words = Object.keys(subtractor)
	return subtractee_words
		.reduce((list, word) => {
			if (!subtractor_words.includes(word)) list.push(word)
			return list
		}, [])
}

module.exports = {
	rank_tokens,
	merge_word_ranks,
	subtract_word_ranks
}