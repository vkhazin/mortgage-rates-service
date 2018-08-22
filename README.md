# mortgage-rates-service
API for Canadian Bank Mortgage Rates

## Design

1. Restful end-point using Node.js with express.js, restify, or hapi 
1. Hosting will be on AWS Lambda and API Gateway
1. All logs to stdout using console.log, console.error and etc. to be captured by CloudWatch Logs automatically

## Sample Request #1

```
GET /
```
## Sample Response #1

```
{
  "mortgages": [
    {
      "provider": "Canadian Lender",
      "rates": [
        {
          "type": "5-years-fixed",
          "rate": 2.45,
          "comment": "Prime - 1.25"
        },
        {
          "type": "3-years-fixed",
          "rate": 3.34
        },
        ... more rates ...
      ]
    },
    {
      "provider": "Peoples Trust",
      "rates": [
        {
          "type": "5-years-fixed",
          "rate": 2.50,
          "comment": "Prime - 1.20"
        },
        {
          "type": "3-years-fixed",
          "rate": 3.39
        },
        ... more rates ...
      ]
    },
    ... more providers ...
  ]
}
```

## Sample Request #2

```
GET /Canadian%20Lender
```
## Sample Response #2

```
{
  "mortgages": [
    {
      "provider": "Canadian Lender",
      "rates": [
        {
          "type": "5-years-fixed",
          "rate": 2.45,
          "comment": "Prime - 1.25"
        },
        {
          "type": "3-years-fixed",
          "rate": 3.34
        },
        ... more rates ...
      ]
    }
  ]
}
```

## Source Data

https://www.ratehub.ca/banks/bank-mortgage-rates loaded and parsed in real-time

## Possible Web Scrapping Components

 * https://scotch.io/tutorials/scraping-the-web-with-node-js
 * https://medium.com/@designman/building-a-performant-web-scraper-in-node-js-5f4449674163
 * 

## Acceptance Criteria

1. No callback functions - use promises instead
2. Error handling to return 500 error with json formatted message and to log error details 
3. Unit tests to validate individual components
4. Integration tests to validate http end-point expected response
5. Deployment script (including deployment pre-requsites) to automate deployment to AWS: bash, ansible, or terraform
6. Unit, Integration and Deployment scripts to run on Amazon EC2 Linux

## Hot to contribute

1. Fork the repo
2. Make changes and commit to your own repository
3. Submit a pull request back into this repository
