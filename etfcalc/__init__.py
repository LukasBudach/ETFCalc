import logging
import json
import operator
from flask import Flask, render_template, request
from operator import itemgetter
from collections import defaultdict
from datetime import datetime
from .util import holdings_calculator
from .util import webscraper
from .util.portfolio import Portfolio
from .util.dateformatter import pretty_date

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
    currency_list = request.form.getlist('currency')

    for ticker, shares, price, currency in zip(ticker_list, share_list, price_list, currency_list):
        if not (ticker and shares and price):
            continue
        shares = int(shares)
        if not shares > 0:
            continue
        portfolio.set_amount(ticker.upper(), shares)
        portfolio.set_price(ticker.upper(), float(price))
        portfolio.set_currency(ticker.upper(), str(currency))

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
            sector = 'Other/Unknown'
        current_weight = sector_data[sector]
        weight = holdings_calculator.round_weight(
            current_weight + holding.get_weight())
        sector_data[sector] = weight

    # news data
    news_list = []
    if data:
        news_list = data[:25]
    news_data = []
    urls = []
    for holding in news_list:
        news_items = holding.get_news()
        if news_items is None:
            continue
        for news_item in news_items:
            url = news_item['url']
            # only display unique articles
            if url in urls:
                continue
            news_data.append(news_item)
            urls.append(url)
    news_data.sort(key=operator.itemgetter('datetime'), reverse=True)

    return render_template('output/output.html', data=data, sector_data=json.dumps(sector_data),
                           news_data=news_data)


@app.route('/ticker_value', methods=['POST'])
def ticker_value():
    ticker = request.form['ticker']
    ticker = ticker.upper()
    ticker_data = webscraper.get_data(ticker, True)
    if ticker_data is None:
        logging.info('invalid ticker, ignoring', ticker)
        return 'null'

    stock_cost = {"price": 0, "currency": "USD"}
    if ticker_data.loc['Yahoo']:
        stock_cost["price"] = ticker_data['Price']
        stock_cost["currency"] = ticker_data['Currency']
    else:
        stock_cost["price"] = webscraper.get_price(ticker)
    return json.dumps(stock_cost)


@app.template_filter('strftime')
def _jinja2_filter_datetime(date, fmt=None):
    return pretty_date(date)
