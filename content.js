function convertCurrency(element, fromCurrency, toCurrency, apiKey) {
  const text = element.textContent;
  const regex = /(\$\d+(?:\.\d+)?)|(€\d+(?:\.\d+)?)|(£\d+(?:\.\d+)?)/g;
  let match;

  while ((match = regex.exec(text)) !== null) {
    let currencySymbol = '$';
    let amount = parseFloat(match[0].replace(/[^0-9.]/g, ''));

    if (match[0].startsWith('€')) {
      currencySymbol = 'EUR';
    } else if (match[0].startsWith('£')) {
      currencySymbol = 'GBP';
    }

    const apiUrl = `https://api.exchangerate-api.com/v4/latest/${currencySymbol}`;

    fetch(apiUrl)
      .then(response => response.json())
      .then(data => {
        if (data.rates && data.rates[toCurrency]) {
          const exchangeRate = data.rates[toCurrency];
          const convertedAmount = (amount * exchangeRate).toFixed(2);
          element.textContent = text.replace(match[0], `${convertedAmount} ${toCurrency}`);
        }
      })
      .catch(error => {
        console.error('Error:', error);
      });
  }
}

// Function to traverse the DOM and convert currencies
function traverseDOM(element, toCurrency, apiKey) {
  if (element.nodeType === Node.TEXT_NODE) {
    convertCurrency(element.parentNode, null, toCurrency, apiKey);
  } else {
    for (let i = 0; i < element.childNodes.length; i++) {
      traverseDOM(element.childNodes[i], toCurrency, apiKey);
    }
  }
}

// Get the API key and target currency from storage, then traverse the DOM
chrome.storage.sync.get(['apiKey', 'toCurrency'], function(data) {
  const apiKey = data.apiKey;
  const toCurrency = data.toCurrency || 'USD'; // Default to USD if not set
  traverseDOM(document.body, toCurrency, apiKey);
});
