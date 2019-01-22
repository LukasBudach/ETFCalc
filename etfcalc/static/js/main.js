document.addEventListener('DOMContentLoaded', function () {
    set_defaults();
});

// useYahooAsBackup, defaultCurrency
let default_options = [false, '$'];

function set_defaults() {
    if (typeof (Storage) == 'undefined') {
        return;
    }

    if (!sessionStorage['option-data']){
        sessionStorage.setItem('option-data', JSON.stringify(default_options));
    }
}