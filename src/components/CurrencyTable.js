import axios from "axios";
import React, { useEffect, useState } from "react";
import "./style.css";

const CurrencyTable = () => {
  const [data, setData] = useState("");
  const [currencyList, setCurrencyList] = useState([]);
  const [requestCurrency, setRequestCurrency] = useState("USD");
  const [prevValues, setPrevValues] = useState({});
  const [classFlag, setClassFlag] = useState(true);

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
    if (data) {
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
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const interval = setInterval(fetchData, 3000);

    return () => {
      clearInterval(interval);
    };
  }, [requestCurrency]);

  useEffect(() => {
    fetchData();
  }, [requestCurrency]);

  useEffect(() => {
    createCurrencyList();
  }, [data]);

  useEffect(() => {
    // Keeping prev values
    if (classFlag) {
      const prevValuesCopy = {};
      currencyList.forEach((currency) => {
        console.log(currencyList, "aaaaaa++++++++++");
        prevValuesCopy[currency.code] = currency.value;
      });
      setPrevValues(prevValuesCopy);
    }
    setClassFlag(true);
  }, [data]);

  console.log(data, "dattaa");
  console.log(requestCurrency, "res");
  console.log(prevValues, "prevValues");

  const onClickHandle = (item) => {
    setRequestCurrency(item.toLowerCase());
    setClassFlag(false);
    setPrevValues({});
  };
  return (
    <>
      <div className="buttons">
        <h2>{`1 ${requestCurrency.toUpperCase()}`}</h2>
        <div className="buttons">
          {currencies
            .filter((item) => {
              return item.toLowerCase() !== requestCurrency.toLowerCase();
            })
            .map((item, index) => {
              return (
                <button key={index + 1} onClick={() => onClickHandle(item)}>
                  {item}
                </button>
              );
            })}
        </div>
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
          {currencyList
            .filter((item) => {
              return item.code.toLowerCase() !== requestCurrency.toLowerCase();
            })
            .map((item, index) => {
              return (
                <tr key={index + 1}>
                  <td style={{ fontWeight: "bold" }}>
                    {item.code.toLowerCase()}
                  </td>
                  <td>{item.name}</td>
                  <td>{item.date.split(" ")[0]}</td>
                  <td
                    className={
                      classFlag
                        ? prevValues[item.code] > item.value
                          ? "decrease"
                          : prevValues[item.code] < item.value
                          ? "increase"
                          : "same"
                        : ""
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
