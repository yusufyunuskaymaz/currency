import axios from "axios";
import React, { useEffect, useState } from "react";
import "./style.css";

const CurrencyTable = () => {
  const [data, setData] = useState("");
  const [currencyList, setCurrencyList] = useState([]);
  const [requestCurrency, setRequestCurrency] = useState("");

  const currencyName = {
    TRY: "Türk Lirası",
    USD: "US Dollar",
    EUR: "Euro",
    JPY: "Japan Yen",
    GBP: "Great British Pound",
    CNY: "Chinese Yuan",
  };


  // Create array for mapping at table
  const createCurrencyList = () => {
    if (data && data.results) {
      const currencyObjects = Object.keys(data.results).map((currencyCode) => ({
        code: currencyCode,
        name: currencyName[currencyCode],
        date: data.updated,
        value: data.results[currencyCode],
      }));
      console.log(currencyObjects, "listt");
      setCurrencyList(currencyObjects);
    }
  };

  const currencies = ["TRY", "USD", "EUR", "JPY", "GBP", "CNY"];
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
    fetchData();
  }, []);

  useEffect(() => {
    createCurrencyList();
  }, [data]);

  console.log(data, "dattaa");
  console.log(requestCurrency,"res")

  return (
    <>
      <h2>{data ? data?.results[`${requestCurrency}`] : ""}</h2>
      <div className="buttons">
        {currencies.map((item, index) => {
          return <button key={index + 1}
          onClick={()=>setRequestCurrency(item.toLowerCase())}
          >{item}</button>;
        })}
      </div>
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
          {currencyList.map((item,index) => {
            return (
              <tr key={index+1}>
                <td>{item.code}</td>
                <td>{item.name}</td>
                <td>{item.date}</td>
                <td>{item.value}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </>
  );
};

export default CurrencyTable;
