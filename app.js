const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const NodeCache = require('node-cache');
const app = express();
const cache = new NodeCache({ stdTTL: 60 * 60, checkperiod: 120 });

let link = 'https://www.ratehub.ca/banks/bank-mortgage-rates'

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
					'rate': parseFloat(html(element).find('td:nth-child(3)').text().trim()) || 0
				},
				{
					'type': '5-years-fixed',
					'rate': parseFloat(html(element).find('td:nth-child(4)').text().trim()) || 0
				},
				{
					'type': '10-years-fixed',
					'rate': parseFloat(html(element).find('td:nth-child(5)').text().trim()) || 0
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
		return parsedData.filter(n => n['provider'].toLowerCase() === decodeURIComponent(name).toLowerCase());
	}
}

let respond = (filteredData, res) => {
	cache.set('/', filteredData, function(err, success) {
		if (!err && success) {
			objectToSave = {
				'mortgages': filteredData
			}
			return res.status(200).send(objectToSave);
		}
	});
}

let handleError = (error, res) => {
	if (error.request) {
		res.status(500).send({ error: 'Failed to get the response from server' });
		console.error(error.request);
	} else {
		res.status(500).send({ error: 'Unknown error happened' });
		console.error('Error', error.message);
	}
	console.error(error.config);
}

app.get('/', function (req, res) {
	let key = '/';
	cache.get(key, (err, value) => {
		if (!err) {
			if (value == undefined) {
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
						return respond(filteredData, res, key);
					})
					.catch((error) => {
						handleError(error, res);
					});
			}
			else {
				console.log('[INFO] JSON retrieved from cache');
				return respond(filter(value, key), res);
			}
		}
	});

});

app.get('/:name', function (req, res) {
	let key = req.params.name;
	cache.get('/', (err, value) => {
		if (!err) {
			if (value == undefined) {
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
						return filter(data, key);
					})
					.then((filteredData) => {
						console.log('[INFO] Responding');
						return respond(filteredData, res, key);
					})
					.catch((error) => {
						handleError(error, res);
					});
			}
			else {
				console.log('[INFO] JSON retrieved from cache');
				return respond(filter(value, key), res);
			}
		}
	});
});

// app.listen(3000, () => console.log('Example app listening on port 3000!'));

// Export your Express configuration so that it can be consumed by the Lambda handler
module.exports = app
