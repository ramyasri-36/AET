import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

export const AlertDistributionChart = ({ data }) => {
  const alertCounts = data.reduce(
    (acc, student) => {
      acc[student.alert_level] = (acc[student.alert_level] || 0) + 1;
      return acc;
    },
    {}
  );

  const chartData = {
    labels: ['Green - Low Risk', 'Yellow - Medium Risk', 'Red - High Risk'],
    datasets: [
      {
        data: [
          alertCounts.Green || 0,
          alertCounts.Yellow || 0,
          alertCounts.Red || 0,
        ],
        backgroundColor: [
          'hsl(145, 65%, 40%)',
          'hsl(38, 92%, 50%)',
          'hsl(0, 70%, 45%)',
        ],
        borderColor: [
          'hsl(220, 20%, 10%)',
          'hsl(220, 20%, 10%)',
          'hsl(220, 20%, 10%)',
        ],
        borderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          padding: 15,
          font: {
            size: 12,
            family: 'Inter',
          },
        },
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            const label = context.label || '';
            const value = context.parsed;
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = ((value / total) * 100).toFixed(1);
            return `${label}: ${value} (${percentage}%)`;
          },
        },
      },
    },
  };

  return (
    <Card className="card-hover col-span-1">
      <CardHeader>
        <CardTitle>Alert Level Distribution</CardTitle>
        <CardDescription>Students by risk category</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <Pie data={chartData} options={options} />
        </div>
      </CardContent>
    </Card>
  );
};

export default AlertDistributionChart;