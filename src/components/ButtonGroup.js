
const ButtonGroup = ({ requestCurrency, onClickHandle, currencies }) => {
  const names = {
    TRY: "Lira",
    USD: "Dolar",
    GBP: "Pound",
    EUR: "Euro",
    JPY: "Japon Yeni",
    CNY: "Çin Yuanı",
  };

  return (
    <div className="container">
      <h2>{`1 ${names[requestCurrency.toUpperCase()]}`}</h2>
      <div className="buttons">
        {currencies.map(
          (item) =>
            item.toLowerCase() !== requestCurrency.toLowerCase() && (
              <button key={item} onClick={() => onClickHandle(item)}>
                {item}
              </button>
            )
        )}
      </div>
    </div>
  );
};
export default ButtonGroup