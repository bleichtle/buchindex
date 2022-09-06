const score = ({
	Chapters,
	TotalTokens,
	UniqueTokens,
	FrequencyList
}) => {
	// TODO: Frequency list should exist as array sorted by rank in the future
	const sorted_frequency_list = Object.keys(FrequencyList)
	.sort((a, b) => FrequencyList[b] - FrequencyList[a])
	// we want to weigh the score based on the percentage of easy words
	const five_star_words = Chapters
		.map(chapter => chapter.WordsByCategory[0])
		.reduce((a, b) => a + b, 0)
	const easy_word_weight = (TotalTokens - five_star_words) / TotalTokens // 0-100 weight of easy words 

	// going off the idea that 98% comprehension is enough to learn new words
	const total_tokens_for_98_percent = 0.98 * TotalTokens
	let tokens_for_98_percent = 0
	let total_tokens_so_far = 0
	for (ranked_word of sorted_frequency_list) {
		total_tokens_so_far += FrequencyList[ranked_word]
		if (total_tokens_so_far > total_tokens_for_98_percent)
			break
		tokens_for_98_percent += 1
	}

	// we want to weigh the variety of words used 
	const word_variety = tokens_for_98_percent / UniqueTokens
	// we want to weigh total number of words as well, so longer books are more difficult
	// every 2000 words that are required will add another 100 score
	const unique_words_required = ( tokens_for_98_percent / 2000 )
	return Math.round(
		(easy_word_weight +
		word_variety +
		unique_words_required) * 100 
	)
}

module.exports = {
	score
}