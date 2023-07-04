import axios from "axios";
import React, { useEffect, useState } from "react";
import "./style.css";

const CurrencyTable = () => {
  const [data, setData] = useState("");
  const [currencyList, setCurrencyList] = useState([]);
  const [requestCurrency, setRequestCurrency] = useState("USD");
  const [prevValues, setPrevValues] = useState({});

  const currencyName = {
    TRY: "Türk Lirası",
    USD: "US Dollar",
    EUR: "Euro",
    JPY: "Japan Yen",
    GBP: "Great British Pound",
    CNY: "Chinese Yuan",
  };

  // Create array for mapping at table
  const currencies = ["TRY", "USD", "EUR", "JPY", "GBP", "CNY"];
  const createCurrencyList = () => {
    if (data && data.results) {
      const currencyObjects = Object.keys(data.results).map((currencyCode) => ({
        code: currencyCode,
        name: currencyName[currencyCode],
        date: data.updated,
        value: data.results[currencyCode],
      }));
      setCurrencyList(currencyObjects);
    }
  };

  const fetchData = async () => {
    const API_KEY = "a57a516e32-808737b59c-rx7xum";
    const toCurrencies = currencies.join(",");
    const API_URL = `https://api.fastforex.io/fetch-multi?from=${requestCurrency}&to=${toCurrencies}&api_key=${API_KEY}`;

    try {
      const response = await axios.get(API_URL);
      setData(response.data);
      createCurrencyList();
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const interval = setInterval(fetchData, 30000);

    // return () => {
    //   clearInterval(interval);
    // };
  }, []);

  useEffect(() => {
    fetchData();
  }, [requestCurrency]);

  useEffect(() => {
    createCurrencyList();
  }, [data]);

  useEffect(() => {
    // Keeping prev values
    const prevValuesCopy = {};
    currencyList.forEach((currency) => {
      prevValuesCopy[currency.code] = currency.value;
    });
    setPrevValues(prevValuesCopy);
  }, [data]);

  console.log(data, "dattaa");
  console.log(requestCurrency, "res");
  console.log(prevValues, "prevValues");

  return (
    <>
      <h2>{`1 ${requestCurrency.toUpperCase()}`}</h2>
      <div className="buttons">
        {currencies.map((item, index) => {
          return (
            <button
              key={index + 1}
              onClick={() => setRequestCurrency(item.toLowerCase())}
            >
              {item}
            </button>
          );
        })}
      </div>
      <br />
      <br />
      <table>
        <thead>
          <tr>
            <th>Kod</th>
            <th>İsmi</th>
            <th>Tarih</th>
            <th>Değer</th>
          </tr>
        </thead>
        <tbody>
          {currencyList.map((item, index) => {
            return (
              <tr key={index + 1}>
                <td style={{ fontWeight: "bold" }}>
                  {item.code.toLowerCase()}
                </td>
                <td>{item.name}</td>
                <td>{item.date.split(" ")[0]}</td>
                <td
                  className={
                    prevValues[item.code] > item.value
                      ? "decrease"
                      : prevValues[item.code] < item.value
                      ? "increase"
                      : "same"
                  }
                >
                
                  {item.value}
                </td>
                Önceki : {prevValues[item.code]}Sonraki: {item.value}
              </tr>
            );
          })}
        </tbody>
      </table>
    </>
  );
};

export default CurrencyTable;
