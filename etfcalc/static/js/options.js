document.addEventListener('DOMContentLoaded', function () {
    console.log('Options built');
});

function reset_options() {

}

function save_options() {
 if (typeof (Storage) == 'undefined') {
        return;
    }

    let data = [];
    let table = document.querySelector('#options-table');
    for (let i = 0; i < table.rows.length; i++) {
        let row = table.rows[i];
        let option = undefined;
        let input;

        try {
            input = row.querySelector('[name=option_val_toggle]');
            option = input.checked;
        } catch (err) {
            try {
                input = row.querySelector('[name=option_val_text]');
                option = input.value;
            } catch (err) {

            }
        }

        if (option === undefined)
            continue;
        data.push(option);
    }
    sessionStorage.setItem('option-data', JSON.stringify(data));
}