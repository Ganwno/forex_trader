import CurrencyChart from './CurrencyChart';

const EUR = {
  data: {
    '2023-02-22': {
      GBP: 0.880328,
      PLN: 4.749501,
      USD: 1.060557
    },
    '2023-02-23': {
      GBP: 0.881946,
      PLN: 4.728053,
      USD: 1.059825
    },
    '2023-02-24': {
      GBP: 0.886129,
      PLN: 4.737987,
      USD: 1.058479
    },
    '2023-02-25': {
      GBP: 0.885972,
      PLN: 4.737216,
      USD: 1.058424
    },
    '2023-02-26': {
      GBP: 0.883107,
      PLN: 4.720205,
      USD: 1.05543
    },
    '2023-02-27': {
      GBP: 0.879661,
      PLN: 4.715239,
      USD: 1.060949
    },
    '2023-02-28': {
      GBP: 0.879016,
      PLN: 4.70739,
      USD: 1.057684
    }
  }
};

const CurrencyDashboard = () => {
  // filtering data - start

  function filterCurrencyRates(obj, currency) {
    const newObj = { data: {} };
    for (const date in obj.data) {
      newObj.data[date] = {};
      newObj.data[date][currency] = obj.data[date][currency];
    }
    return newObj;
  }

  const filteredGBP = filterCurrencyRates(EUR, 'GBP');
  console.log(filteredGBP);

  // filtering data - end

  return (
    <>
      <CurrencyChart />
    </>
  );
};

export default CurrencyDashboard;
