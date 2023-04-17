import { useState, useEffect, useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { useGetHistoricalRateQuery } from '../../../redux/api/apiSlice';

import { Dropdown } from 'primereact/dropdown';
import { Card } from 'primereact/card';
import { Chart } from 'primereact/chart';

const CurrencyChart = () => {
  const [secondSelectedCurrency, setSecondSelectedCurrency] = useState('PLN');
  const [firstSelectedCurrency, setFirstSelectedCurrency] = useState('EUR');
  const [chartData, setChartData] = useState([]);
  const [chartOptions, setChartOptions] = useState([]);
  const dispatch = useDispatch();

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

  // generating last 7 days dates for chart labels
  function generateDates() {
    const dates = [];
    const today = new Date();

    for (let i = 6; i >= 1; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateString = date.toISOString().slice(0, 10);
      dates.push(dateString);
    }
    return dates;
  }

  const weekDates = generateDates();

  const {
    data: currencyHistoricalData,
    error,
    isLoading,
    isError
  } = useGetHistoricalRateQuery({
    firstCurrency: firstSelectedCurrency,
    secondCurrency: secondSelectedCurrency,
    startDate: weekDates[0],
    endDate: weekDates[5]
  });

  // applying chart data and labels and generating chart
  useEffect(() => {
    const gridColor = 'rgba(126, 126, 128, 0.3)';
    const labelColor = 'rgba(126, 126, 128)';

    const filteredData = currencyHistoricalData
      ? Object.values(currencyHistoricalData.data)
          .map((item) => item[secondSelectedCurrency])
          .flat()
      : [];

    const data = {
      labels: weekDates,
      datasets: [
        {
          data: filteredData,
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
  }, [firstSelectedCurrency, secondSelectedCurrency]);

  //generating chart when the app starts or when any of the dropdown values change

  // preventing dropdowns from displaying the same value
  useEffect(() => {
    if (firstSelectedCurrency === secondSelectedCurrency) {
      setFirstSelectedCurrency('EUR');
      setSecondSelectedCurrency('PLN');
    }
  }, [firstSelectedCurrency, secondSelectedCurrency]);

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
          onChange={(e) => {
            setSecondSelectedCurrency(e.target.value);
          }}
          options={secondDropdownOptions}
          optionLabel="name"
          optionValue="code"
        />
      </div>
      <Chart type="line" data={chartData} options={chartOptions} className="p-0 m-0 md:m-1"></Chart>
    </Card>
  );
};

export default CurrencyChart;
