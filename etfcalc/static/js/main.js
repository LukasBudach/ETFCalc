function load_options() {
    let options = [];
    options.push(
        {
            title: 'Use Yahoo as backup data source',
            type: 'toggle',
            description: 'When enabled a webscraper will search through Yahoo page code for quotes on ticker symbols' +
                'hat are unknown to our other sources. This will however slow down the data fetching.',
            value: false
        }
    );
    options.push(
        {
            title: 'Default currency',
            type: 'text',
            description: 'This sets your preferred default currency, used for all calculations in this tool.',
            value: '$'
        }
    );

    $.ajax({
        data: {
            options: JSON.stringify(options)
        },
        type: 'POST',
        url: '/options',
        success: function(response) {
            document.write(response);
            document.close();
        }
    });
}