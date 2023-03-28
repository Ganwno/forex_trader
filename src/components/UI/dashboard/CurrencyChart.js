import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { Dropdown } from 'primereact/dropdown';
import { Card } from 'primereact/card';
import { Chart } from 'primereact/chart';

import { currencyActions } from '@/redux/slices/currency-rates-slice';

import { allCurrencies } from '../../../../public/dummy-data';

const CurrencyChart = () => {
  const [secondSelectedCurrency, setSecondSelectedCurrency] = useState('PLN');
  const [firstSelectedCurrency, setFirstSelectedCurrency] = useState('EUR');
  const [chartData, setChartData] = useState([]);
  const [chartOptions, setChartOptions] = useState([]);
  const currencyRates = useSelector((state) => state.currencyRates);

  const dispatch = useDispatch();

  const onChangeSecondDropdownHandler = (event) => {
    const selectedCurrency = event.target.value;
    setSecondSelectedCurrency(selectedCurrency);
    dispatch(
      currencyActions.filterCurrencyRates({
        obj: allCurrencies[firstSelectedCurrency],
        currency: selectedCurrency // use the newly selected currency here
      })
    );
  };

  // -----> CHART BEHAVIOUR <-----

  // generating last 7 days dates for chart labels
  const today = new Date();
  let weekDates = [];
  for (let i = 7; i >= 1; i--) {
    let date = new Date(today);
    date.setDate(today.getDate() - i);
    weekDates.push(date.toLocaleDateString());
  }

  // applying chart data and labels and generating chart
  useEffect(() => {
    const gridColor = 'rgba(126, 126, 128, 0.3)';
    const labelColor = 'rgba(126, 126, 128)';

    const data = {
      labels: weekDates,
      datasets: [
        {
          data: currencyRates,
          fill: true,
          borderColor: 'rgba(242, 239, 82, 1)',
          tension: 0,
          backgroundColor: 'rgba(242, 239, 82, 0.3)'
        }
      ]
    };
    const options = {
      maintainAspectRatio: false,
      aspectRatio: 1.2,
      responsive: true,
      plugins: {
        legend: {
          display: false
        }
      },
      scales: {
        x: {
          ticks: {
            color: labelColor
          },
          grid: {
            color: gridColor
          }
        },
        y: {
          ticks: {
            color: labelColor
          },
          grid: {
            color: gridColor
          }
        }
      }
    };

    setChartData(data);
    setChartOptions(options);
    console.log(currencyRates);
    // console.log(data);
  }, [secondSelectedCurrency]);

  // -----> DROPDOWN BEHAVIOUR <-----

  // first dropdown options
  const firstDropdownOptions = [
    { name: 'EUR', code: 'EUR' },
    { name: 'USD', code: 'USD' },
    { name: 'PLN', code: 'PLN' },
    { name: 'GBP', code: 'GBP' }
  ];
  // generating second dropdown options basing on options from first dropdown
  const secondDropdownOptions = firstDropdownOptions.filter(
    (currency) => currency.code !== firstSelectedCurrency
  );

  // preventing dropdowns from displaying the same value
  useEffect(() => {
    if (firstSelectedCurrency === secondSelectedCurrency) {
      setSecondSelectedCurrency(secondDropdownOptions[1].name);
    }
  }, [firstSelectedCurrency]);

  return (
    <Card className="mx-3 lg:mx-4 mb-3 lg:mb-0 px-1 border-round-xl font-light">
      <div className="w-full grid px-2 mb-3">
        <p className="col-12 text-xl md:text-2xl lg:text-4xl mb-2 lg:mb-4 p-0">{`Let's see things in more details`}</p>
        <Dropdown
          className="w-6rem"
          inputId="dd-first-currency"
          value={firstSelectedCurrency}
          onChange={(e) => {
            setFirstSelectedCurrency(e.target.value);
          }}
          options={firstDropdownOptions}
          optionLabel="name"
          optionValue="code"
        />
        <i
          className="pi pi-angle-right align-self-center"
          style={{ color: 'var(--primary-500)' }}></i>
        <Dropdown
          className="w-6rem"
          inputId="dd-second-currency"
          value={secondSelectedCurrency}
          onChange={
            onChangeSecondDropdownHandler
            // setSecondSelectedCurrency(e.target.value);
            // dispatch(
            //   currencyActions.filterCurrencyRates({
            //     obj: allCurrencies[firstSelectedCurrency],
            //     currency: secondSelectedCurrency
            //   })
            // );
          }
          options={secondDropdownOptions}
          optionLabel="name"
          optionValue="code"
        />
        <p className="col-12 opacity-50 lg:mt-3 lg:mb-3">
          {`As of today: 1 ${firstSelectedCurrency} = ${
            currencyRates[currencyRates.length - 1]
          } ${secondSelectedCurrency}`}
        </p>
      </div>
      <Chart type="line" data={chartData} options={chartOptions} className="p-0 m-0 md:m-1"></Chart>
    </Card>
  );
};

export default CurrencyChart;
