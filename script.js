const apiKey = 'a8d5c0fdd509a5387b4048bd';
const apiURL = `https://v6.exchangerate-api.com/v6/${apiKey}/latest/USD`;

let fromAmount = '';
let fromCurrencySymbol = '€';
let toCurrencySymbol = 'S/.';

const fromAmountDisplay = document.getElementById('fromAmount');
const toAmountDisplay = document.getElementById('toAmount');
const fromSymbol = document.getElementById('fromSymbol');
const toSymbol = document.getElementById('toSymbol');
const fromCurrency = document.getElementById('fromCurrency');
const toCurrency = document.getElementById('toCurrency');
const conversionRateDiv = document.getElementById('conversionRate');

// Cargar las monedas al inicio
async function loadCurrencies() {
    try {
        const response = await fetch(apiURL);
        const data = await response.json();
        const currencies = Object.keys(data.conversion_rates);

        currencies.forEach(currency => {
            const optionFrom = document.createElement('option');
            const optionTo = document.createElement('option');
            optionFrom.value = currency;
            optionFrom.textContent = currency;
            optionTo.value = currency;
            optionTo.textContent = currency;
            fromCurrency.appendChild(optionFrom);
            toCurrency.appendChild(optionTo);
        });
    } catch (error) {
        console.error('Error al cargar las monedas:', error);
    }
}

// Actualizar el símbolo de moneda
fromCurrency.addEventListener('change', () => {
    const selected = fromCurrency.value;
    updateCurrencySymbol(selected, 'from');
});

toCurrency.addEventListener('change', () => {
    const selected = toCurrency.value;
    updateCurrencySymbol(selected, 'to');
});

function updateCurrencySymbol(currency, type) {
    const symbols = {
        'EUR': '€',
        'USD': '$',
        'PEN': 'S/.',
        // Agrega más símbolos si es necesario
    };

    if (type === 'from') {
        fromCurrencySymbol = symbols[currency] || currency;
        fromSymbol.textContent = fromCurrencySymbol;
    } else if (type === 'to') {
        toCurrencySymbol = symbols[currency] || currency;
        toSymbol.textContent = toCurrencySymbol;
    }
}

// Añadir número o coma al monto
function appendNumber(number) {
    if (number === '.' && fromAmount.includes('.')) {
        return; // Evitar múltiples puntos decimales
    }
    fromAmount += number;
    fromAmountDisplay.textContent = `${fromAmount} ${fromCurrencySymbol}`;
}

// Limpiar el monto
function clearAmount() {
    fromAmount = '';
    fromAmountDisplay.textContent = `0 ${fromCurrencySymbol}`;
    toAmountDisplay.textContent = `0 ${toCurrencySymbol}`;
}

// Realizar la conversión
async function convertCurrency() {
    const amount = parseFloat(fromAmount);
    const from = fromCurrency.value;
    const to = toCurrency.value;

    if (isNaN(amount) || from === "" || to === "") {
        toAmountDisplay.textContent = `0 ${toCurrencySymbol}`;
        return;
    }

    try {
        const response = await fetch(`https://v6.exchangerate-api.com/v6/${apiKey}/pair/${from}/${to}/${amount}`);
        const data = await response.json();

        if (data.result === 'success') {
            const convertedAmount = data.conversion_result;
            const rate = data.conversion_rate;
            toAmountDisplay.textContent = `${convertedAmount.toFixed(2)} ${toCurrencySymbol}`;
            conversionRateDiv.textContent = `1 ${from} = ${rate.toFixed(4)} ${to}`;
        } else {
            toAmountDisplay.textContent = `Error`;
        }
    } catch (error) {
        console.error('Error al realizar la conversión:', error);
        toAmountDisplay.textContent = `Error`;
    }
}

// Cargar monedas al inicio
loadCurrencies();
