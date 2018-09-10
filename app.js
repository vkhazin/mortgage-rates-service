var express = require('express');
var axios = require('axios');
var cheerio = require('cheerio');
var app = express();

let link = 'httpss://www.ratehub.ca/banks/bank-mortgage-rates'

let parseHtml = (response) => {
	return cheerio.load(response.data);
}

let scrape = (html) => {
	let parsedData = []
	html('.rh-table > tbody > tr').each(function (i, element) {
		let row = {
			'provider': html(element).find('span .provider-name').text().trim(),
			'rates': [
				{
					'type': '5-years-variable',
					'rate': parseFloat(html(element).find('td:nth-child(2) > a > span > span').text().trim()) || 0,
					'comment': html(element).find('td:nth-child(2) > a > span > div').text().trim()
				},
				{
					'type': '3-years-fixed',
					'rate': parseFloat(html(element).find('td:nth-child(3)').text().trim())  || 0
				},
				{
					'type': '5-years-fixed',
					'rate': parseFloat(html(element).find('td:nth-child(4)').text().trim()) || 0
				},
				{
					'type': '10-years-fixed',
					'rate': parseFloat(html(element).find('td:nth-child(5)').text().trim())  || 0
				}
			]
		}
		parsedData.push(row);
	});
	return parsedData;
}

let filter = (parsedData, name) => {
	if (name === undefined) {
		return parsedData.filter(n => n['provider'] !== '');
	}
	else {
		return parsedData.filter(n => n['provider'] === decodeURIComponent(name));
	}
}

let respond = (filteredData, res) => {
	return res.status(200).send({
		'mortgages': filteredData
	});
}

let handleError = (error, res) => {
	if (error.request) {
		res.status(500).send({ error: 'Failed to get the response from server' });
		console.log(error.request);
	} else {
		res.status(500).send({ error: 'Unknown error happened' });
		console.log('Error', error.message);
	}
	console.log(error.config);
}

app.get('/', function (req, res) {
	axios.get(link)
		.then((response) => {
			console.log('[INFO] Parsing');
			return parseHtml(response, res);
		})
		.then((html) => {
			console.log('[INFO] Scraping');
			return scrape(html);
		})
		.then((data) => {
			console.log('[INFO] Filtering');
			return filter(data);
		})
		.then((filteredData) => {
			console.log('[INFO] Responding');
			return respond(filteredData, res);
		})
		.catch((error) => {
			handleError(error, res);
		});
});

app.get('/:name', function (req, res) {
	axios.get(link)
		.then((response) => {
			console.log('[INFO] Parsing');
			return parseHtml(response, res);
		})
		.then((html) => {
			console.log('[INFO] Scraping');
			return scrape(html);
		})
		.then((data) => {
			console.log('[INFO] Filtering');
			return filter(data, req.params.name);
		})
		.then((filteredData) => {
			console.log('[INFO] Responding');
			return respond(filteredData, res);
		})
		.catch((error) => {
			handleError(error, res);
		});
});

// app.listen(3000, () => console.log('Example app listening on port 3000!'))


// Export your Express configuration so that it can be consumed by the Lambda handler
module.exports = app
