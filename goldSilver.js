/* const axios = require('axios');

// Conversion constants
const OZ_TO_GRAM = 31.1035;
const GRAM_TO_KG = 1000;
const TOLA_TO_GRAM = 11.66;

// Gold purity factors for different carats
const PURITY_24K = 1.00; // 100% pure gold
const PURITY_22K = 0.9167; // 91.67% pure gold
const PURITY_21K = 0.8750; // 87.5% pure gold
const PURITY_18K = 0.7500; // 75% pure gold

// Gold price API URL (replace with the correct API endpoint)
const RATES_API_URL = 'https://data-asg.goldprice.org/dbXRates/USD';

// Function to fetch data from API and calculate gold and silver prices
const getGoldSilverRates = async () => {
    try {
        console.log("working ....")
        const response = await axios.get('https://data-asg.goldprice.org/dbXRates/USD', {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:91.0) Gecko/20100101 Firefox/91.0'
            }
        });
        // console.log(response)
        // return response
        console.log(response.data)
        const data = response.data.items;
        
        const ratesCollection = data.map(item => {
            const currency = item.curr;
            const goldPriceOZ = item.xauPrice;
            const silverPriceOZ = item.xagPrice;

            // Gold price conversions
            const goldPriceG = goldPriceOZ / OZ_TO_GRAM;
            const goldPriceKG = goldPriceG * GRAM_TO_KG;
            const goldPriceTola = goldPriceG * TOLA_TO_GRAM;

            // Gold prices for different purities
            const goldPrice24K = goldPriceOZ * PURITY_24K;
            const goldPrice22K = goldPriceOZ * PURITY_22K;
            const goldPrice21K = goldPriceOZ * PURITY_21K;
            const goldPrice18K = goldPriceOZ * PURITY_18K;

            // Silver price conversions
            const silverPriceG = silverPriceOZ / OZ_TO_GRAM;
            const silverPriceKG = silverPriceG * GRAM_TO_KG;
            const silverPriceTola = silverPriceG * TOLA_TO_GRAM;

            return {
                currency,
                gold_rates: {
                    Price_OZ: goldPriceOZ.toFixed(2),
                    Price_G: goldPriceG.toFixed(2),
                    Price_KG: goldPriceKG.toFixed(2),
                    Price_Tola: goldPriceTola.toFixed(2),
                    Price_24K: goldPrice24K.toFixed(2),
                    Price_22K: goldPrice22K.toFixed(2),
                    Price_21K: goldPrice21K.toFixed(2),
                    Price_18K: goldPrice18K.toFixed(2),
                },
                silver_rates: {
                    Price_OZ: silverPriceOZ.toFixed(2),
                    Price_G: silverPriceG.toFixed(2),
                    Price_KG: silverPriceKG.toFixed(2),
                    Price_Tola: silverPriceTola.toFixed(2),
                }
            };
        });

        return ratesCollection;
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error;
    }
};

// Define the API endpoint
exports.goldSilverRate = async (req, res) => {
    try {
        const rates = await getGoldSilverRates();
        res.json(rates);
    } catch (error) {
        res.status(500).send('Error fetching gold and silver prices');
    }
}; */


const axios = require('axios');

const OZ_TO_GRAM = 31.1035;
const GRAM_TO_KG = 1000;
const TOLA_TO_GRAM = 11.66;

const PURITY_24K = 1.00;
const PURITY_22K = 0.9167;
const PURITY_21K = 0.8750;
const PURITY_18K = 0.7500;

const RATES_API_URL = 'https://data-asg.goldprice.org/dbXRates/USD';
const EXCHANGE_RATE_API_URL = 'https://api.exchangerate-api.com/v4/latest/USD'; // Example exchange rate API

const getGoldSilverRates = async () => {
    try {
        console.log("Fetching gold and silver prices...");

        const response = await axios.get(RATES_API_URL, {
            headers: {
                'User-Agent': 'Mozilla/5.0'
            }
        });

        const exchangeRateResponse = await axios.get(EXCHANGE_RATE_API_URL);
        const usdToInrRate = exchangeRateResponse.data.rates.INR;

        const data = response.data.items;
        const ratesCollection = data.map(item => {
            const goldPriceOZ = item.xauPrice;
            const silverPriceOZ = item.xagPrice;

            const goldPriceOZ_INR = goldPriceOZ * usdToInrRate;
            const silverPriceOZ_INR = silverPriceOZ * usdToInrRate;

            const goldPriceG_INR = goldPriceOZ_INR / OZ_TO_GRAM;
            const goldPriceKG_INR = goldPriceG_INR * GRAM_TO_KG;
            const goldPriceTola_INR = goldPriceG_INR * TOLA_TO_GRAM;
            const goldPrice10G_INR = goldPriceG_INR * 10;  // Price for 10 grams

            const silverPriceG_INR = silverPriceOZ_INR / OZ_TO_GRAM;
            const silverPriceKG_INR = silverPriceG_INR * GRAM_TO_KG;
            const silverPriceTola_INR = silverPriceG_INR * TOLA_TO_GRAM;

            return {
                currency: "INR",  // Change the currency to INR
                gold_rates: {
                    Price_OZ: goldPriceOZ_INR.toFixed(2),
                    Price_G: goldPriceG_INR.toFixed(2),
                    Price_10G: goldPrice10G_INR.toFixed(2),  // Price for 10 grams
                    Price_KG: goldPriceKG_INR.toFixed(2),
                    Price_Tola: goldPriceTola_INR.toFixed(2),
                    Price_24K: (goldPriceOZ_INR * PURITY_24K).toFixed(2),
                    Price_22K: (goldPriceOZ_INR * PURITY_22K).toFixed(2),
                    Price_21K: (goldPriceOZ_INR * PURITY_21K).toFixed(2),
                    Price_18K: (goldPriceOZ_INR * PURITY_18K).toFixed(2),
                },
                silver_rates: {
                    Price_OZ: silverPriceOZ_INR.toFixed(2),
                    Price_G: silverPriceG_INR.toFixed(2),
                    Price_KG: silverPriceKG_INR.toFixed(2),
                    Price_Tola: silverPriceTola_INR.toFixed(2),
                }
            };
        });

        return ratesCollection;
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error;
    }
};

exports.goldSilverRate = async (req, res) => {
    try {
        const rates = await getGoldSilverRates();
        res.json(rates);
    } catch (error) {
        res.status(500).send('Error fetching gold and silver prices');
    }
};
