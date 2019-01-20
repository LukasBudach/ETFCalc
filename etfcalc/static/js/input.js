document.addEventListener('DOMContentLoaded', function () {
    for (let i = 0; i < 3; i++) {
        add_row();
    }

    load_data();
});

function save_data() {
    if (typeof (Storage) == 'undefined') {
        return;
    }

    let data = []
    let table = document.getElementById('holding-table');
    for (let i = 0; i < table.rows.length; i++) {
        let row = table.rows[i];
        let ticker = row.querySelector('[name=tickers]').value;
        let shares = row.querySelector('[name=shares]').value;
        let price = row.querySelector('[name=prices]').value;
        if (!(ticker && shares && price))
            continue;
        data.push([ticker.toUpperCase(), shares, price]);
    }
    sessionStorage.setItem('form-data', JSON.stringify(data));
}

function load_data() {
    let table = document.getElementById('holding-table');
    let session_data = sessionStorage['form-data'];

    if (!session_data) {
        return;
    }
    let data = JSON.parse(session_data);
    for (let i = table.rows.length; i < data.length; i++) {
        add_row();
    }

    for (let i = 0; i < data.length; i++) {
        if (!(data[i][0] && data[i][1] && data[i][2]))
            continue;

        let row = table.rows[i];
        row.querySelector('[name=tickers]').value = data[i][0];
        row.querySelector('[name=shares]').value = data[i][1];
        row.querySelector('[name=prices]').value = data[i][2];
    }
}

function add_row() {
    let row = document.getElementsByTagName('template')[0];
    let table = document.getElementById('holding-table');
    let clone = row.content.cloneNode(true);
    if (table.rows.length == 1) {
        let button = table.rows[0].querySelector('button');
        button.removeAttribute('disabled');
    }
    table.appendChild(clone);
}

function remove_row(el) {
    let tr = el.parentElement.parentElement;
    let table = document.getElementById('holding-table');

    $(tr.querySelectorAll('input')[0]).tooltip({ trigger: 'manual' }).tooltip('hide');
    tr.parentElement.removeChild(tr);

    if (table.rows.length == 1) {
        let button = table.rows[0].querySelector('button');
        button.setAttribute('disabled', true);
    }
}

function ticker_value(el, ticker) {
    if (!ticker) {
        return;
    }
    let tr = el.parentElement.parentElement;
    let spinner = tr.querySelector('.spinner');
    spinner.classList.remove('hidden');
    $.ajax({
        data: {
            ticker: ticker
        },
        type: 'POST',
        url: '/ticker_value'
    }).done(function (data) {
        spinner.classList.add('hidden');
        if (data.error) {
            console.log('Error fetching price data', data.error);
            return;
        }
        if (data == 'null') {
            invalid_ticker(el, ticker);
            return;
        }
        let price_input = tr.querySelectorAll('input')[2];
        $(el).tooltip({ trigger: 'manual' }).tooltip('hide');
        price_input.value = data;
        console.log(price_input);
        check_form_valid();
    });
}

function invalid_ticker(el) {
    $(el).tooltip({ trigger: 'manual' }).tooltip('show');
}

function check_form_valid() {
    let form_is_valid = false;
    let all_inputs = document.querySelectorAll('input');
    let i = 0;
    for (i; i < all_inputs.length; i += 3) {
        let stock_symbol = all_inputs[i].value;
        let share_count = all_inputs[i+1].value;
        let stock_price = all_inputs[i+2].value;
        if (stock_symbol) {
            if (share_count) {
                if (stock_price) {
                    form_is_valid = true;
                }
            }
            console.log('share count: ' + share_count);
            console.log('price per share: ' + stock_price);
            console.log('form is valid: ' + form_is_valid);
        }
    }
    let calc_button = document.querySelector('#calculateBtn');
    calc_button.disabled = !form_is_valid;
}