import logging
import json
import operator
from flask import Flask, render_template, request
from operator import itemgetter
from collections import defaultdict
from .util import holdings_calculator
from .util import webscraper
from .util.portfolio import Portfolio

app = Flask(__name__)


@app.route('/')
def main(error=False):
    return render_template('input/input.html', error=error)


@app.route('/output', methods=['POST'])
def output():
    portfolio = Portfolio()

    ticker_list = request.form.getlist('tickers')
    share_list = request.form.getlist('shares')
    price_list = request.form.getlist('prices')

    for ticker, shares, price in zip(ticker_list, share_list, price_list):
        if not (ticker and shares and price):
            continue
        portfolio.set_amount(ticker.upper(), int(shares))
        portfolio.set_price(ticker.upper(), float(price))

    if portfolio.get_holdings():
        try:
            data = holdings_calculator.get_holdings(portfolio)
        except ValueError as e:
            logging.exception('Raised exception while making request')
            return main(True)
    else:
        data = {}

    # sector data
    sector_data = defaultdict(float)
    for holding in data:
        sector = holding.get_sector()
        if sector is None:
            continue
        current_weight = sector_data[sector]
        weight = holdings_calculator.round_weight(
            current_weight + holding.get_weight())
        sector_data[sector] = weight

    # news data
    news_data = []
    news_list = data[:15]
    for holding in news_list:
        news_items = holding.get_news()
        if news_items is None:
            continue
        for news_item in news_items:
            news_data.append(news_item)
    news_data.sort(key=operator.itemgetter('datetime'), reverse=True)

    return render_template('output/output.html', data=data, sector_data=json.dumps(sector_data), 
        news_data=news_data)


@app.route('/ticker_value', methods=['POST'])
def ticker_value():
    ticker = request.form['ticker']
    ticker = ticker.upper()
    if (webscraper.get_data(ticker) is None):
        logging.info('invalid ticker, ignoring', ticker)
        return 'null'

    price = webscraper.get_price(ticker)
    return str(price)
