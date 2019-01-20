# ETFCalc

## Objective
An [exchange traded fund (etf)](https://en.wikipedia.org/wiki/Exchange-traded_fund) holds a number of underlying stocks. This tool attempts to simplify viewing the portion of a portfolio that is made up by the underlying stocks of ETFs. The tool allows a user to enter the list of stocks and ETFs held in their portfolio and will then calculate and output the percentage of the portfolio that each underlying stock makes up.

##  Steps Taken
This project is a fork of [jjacobson/ETFCalc](https://github.com/jjacobson/ETFCalc). This project's master includes all changes made by me to this project, that I deem stable and enough of an improvement to be merged into the main project. Even if their pull-requests are denied in the main project, they can still be found here! I also try to keep the dev branch exactly up to date with the main project's master, but if you want to use that one I recommend simply going over to jjacobson and getting the app there. 

Stock price data is retrieved from yahoo finance through the use of Pandas Datareader. ETF holdings are currently scraped from http://etfdb.com through python requests.


## Project Setup
As this project is still in development it does not come with an easy to use installer. If you want to run or contribute to the app you will need to have Python 3.0 or higher installed on your PC.

### Windows Setup
First clone this repsitory or download the code as `` .zip `` file. If you added the `` python.exe `` to your system path you can now navigate to the ETFCalc folder, open a command prompt and execute `` python .\setup.py install``. If you haven't added python to your PATH refer to [this article](https://www.pythoncentral.io/execute-python-script-file-shell/) for help if required. The `` setup.py `` script should now install all dependencies required for running this project.

After the setup is done you can simply call `` python .\run.py `` from the same command prompt and the app should be up and running on http://127.0.0.1:500/

Using a python IDE like JetBrains PyCharm can make running this project easier.

## How to contribute
So you have decided to contribute to this amazing app? Great! In order to get started you will need a git installation. Next you want to fork the project and put in a pull request when you want your contributions to be added to the master.

If you are using an IDE make sure not to push any directories or files solely created by your environment that are not required for the project to be run on a different machine within a different IDE or even without one.

### Pictures
![Input page](https://i.imgur.com/B8qQW5D.png)
![Output page](https://i.imgur.com/ZqUqxeF.png)
