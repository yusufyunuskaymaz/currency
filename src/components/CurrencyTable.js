import axios from "axios";
import React, { useEffect, useState } from "react";
import "./style.css";
import ButtonGroup from "./ButtonGroup";

const CurrencyTable = () => {
  const [data, setData] = useState("");
  const [currencyList, setCurrencyList] = useState([]);
  const [requestCurrency, setRequestCurrency] = useState("USD");
  const [prevValues, setPrevValues] = useState({});
  const [classFlag, setClassFlag] = useState(true);

  useEffect(() => {
    fetchData();
  }, [requestCurrency]);

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
  const symbols = {
    TRY: "₺",
    USD: "$",
    GBP: "£",
    EUR: "€",
    JPY: "¥",
    CNY: "¥",
  };
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
    const API_KEY = "8f005c2b37-0967ad70cf-rxmta8";
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
    const interval = setInterval(fetchData, 60000);

    return () => {
      clearInterval(interval);
    };
  }, [requestCurrency]);

  useEffect(() => {
    // Keeping prev values
    if (classFlag) {
      const prevValuesCopy = {};
      currencyList.forEach((currency) => {
        prevValuesCopy[currency.code] = currency.value;
      });
      setPrevValues(prevValuesCopy);
    }
    setClassFlag(true);

    createCurrencyList();
  }, [data]);

  const onClickHandle = (item) => {
    setRequestCurrency(item.toLowerCase());
    setClassFlag(false);
    setPrevValues({});
  };
  return (
    <div className="main">
    <h1>Currency App</h1>
      <ButtonGroup
        requestCurrency={requestCurrency}
        onClickHandle={onClickHandle}
        currencies={currencies}
      />
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
          {currencyList.map(
            (item, index) =>
              item.code.toLowerCase() !== requestCurrency.toLowerCase() && (
                <tr key={index + 1}>
                  <td className="currencyCode">{item.code.toLowerCase()}</td>
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
                    id="currencyValue"
                  >
                    <span className="currencySymbol">{symbols[item.code]}</span>{" "}
                    {item.value.toFixed(2)}
                  </td>
                </tr>
              )
          )}
        </tbody>
      </table>
    </div>
  );
};

export default CurrencyTable;
