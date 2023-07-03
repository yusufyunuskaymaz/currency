import axios from "axios";
import React, { useEffect, useState } from "react";
import "./style.css"

const CurrencyTable = () => {
  const [data, setData] = useState("");

  const fetchData = async () => {
    const API_KEY = "a57a516e32-808737b59c-rx7xum";
    const currencies = ["TRY", "USD", "EUR", "JPY", "GBP", "CNY"];
    const toCurrencies = currencies.join(",");
    const requestCurrency = "USD"
    const API_URL = `https://api.fastforex.io/fetch-multi?from=${requestCurrency}&to=${toCurrencies}&api_key=${API_KEY}`;

    try {
      const response = await axios.get(API_URL);
      setData(response.data);

    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);
  
  console.log(data, "dattaa");


  return (
    <div className="buttons">
      <button>TRY</button>
      <button>USD</button>
      <button>EUR</button>
      <button>JPY</button>
      <button>GBP</button>
      <button>CNY</button>
    </div>
  );
};

export default CurrencyTable;
