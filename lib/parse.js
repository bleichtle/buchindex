const remove_html = (text) => {
  return text
    .replace(/\n/ig, '')
    .replace(/<style[^>]*>[\s\S]*?<\/style[^>]*>/ig, '')
    .replace(/<head[^>]*>[\s\S]*?<\/head[^>]*>/ig, '')
    .replace(/<script[^>]*>[\s\S]*?<\/script[^>]*>/ig, '')
    .replace(/<\/\s*(?:p|div)>/ig, '\n')
    .replace(/<br[^>]*\/?>/ig, '\n')
    .replace(/<[^>]*>/ig, '')
    .replace('&nbsp;', ' ')
    .replace(/[^\S\r\n][^\S\r\n]+/ig, ' ')
}

const convert_text_to_tokens = (text) => {
	return text
		.replace(/[^a-zA-ZäöüÄÖÜß\ ]/g, ' ')
		.split(' ')
		.filter(token => token != '')
		.map(token => token.toLowerCase()) 
}

const normalize_author_name = (author) => {
	return author
}

module.exports = {
	remove_html,
	convert_text_to_tokens,
	normalize_author_name
}