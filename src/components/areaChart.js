import React from 'react';
import ReactApexChart from 'react-apexcharts';

const AreaChart = ({ workouts }) => {
  const chartData = {
    series: [
      {
        name: 'Weight',
        data: workouts.map(workout => workout.sets.weights[0])
      },
      {
        name: 'Reps',
        data: workouts.map(workout => workout.sets.reps[0])
      }
    ],
    options: {
      chart: {
        height: 350,
        type: 'area',
        zoom: {
          enabled: false
        }
      },
      xaxis: {
        categories: workouts.map((workout, index) => `Workout ${index + 1}`)
      },
      yaxis: [
        {
          title: {
            text: 'Weight (lbs)'
          }
        },
        {
          opposite: true,
          title: {
            text: 'Reps'
          }
        }
      ]
    }
  };

  return (
    <div>
      <ReactApexChart
        options={chartData.options}
        series={chartData.series}
        type="area"
        height={350}
      />
    </div>
  );
};

export default AreaChart;
