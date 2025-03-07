document.addEventListener('DOMContentLoaded', function() {
  const amountInput = document.getElementById('amount');
  const fromCurrencySelect = document.getElementById('fromCurrency');
  const toCurrencySelect = document.getElementById('toCurrency');
  const convertButton = document.getElementById('convertButton');
  const resultDiv = document.getElementById('result');

  convertButton.addEventListener('click', function() {
    const amount = parseFloat(amountInput.value);
    const fromCurrency = fromCurrencySelect.value;
    const toCurrency = toCurrencySelect.value;

    if (isNaN(amount)) {
      resultDiv.textContent = 'Please enter a valid amount.';
      return;
    }

    // Use a free currency conversion API
    const apiKey = '70d7de7674b981f318cdd213'; // Replace with your API key
    const apiUrl = `https://api.exchangerate-api.com/v4/latest/${fromCurrency}`;

    fetch(apiUrl)
      .then(response => response.json())
      .then(data => {
        if (data.rates && data.rates[toCurrency]) {
          const exchangeRate = data.rates[toCurrency];
          const result = (amount * exchangeRate).toFixed(2);
          resultDiv.textContent = `${amount} ${fromCurrency} = ${result} ${toCurrency}`;
        } else {
          resultDiv.textContent = 'Failed to convert currency.';
        }
      })
      .catch(error => {
        console.error('Error:', error);
        resultDiv.textContent = 'Failed to fetch exchange rates.';
      });
  });
});
