import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

export const ImprovementTrendChart = ({ data }) => {
  const trendCounts = data.reduce(
    (acc, student) => {
      acc[student.improvement_trend] = (acc[student.improvement_trend] || 0) + 1;
      return acc;
    },
    {}
  );

  const chartData = {
    labels: ['Improving', 'Stable', 'Declining'],
    datasets: [
      {
        data: [
          trendCounts.Improving || 0,
          trendCounts.Stable || 0,
          trendCounts.Declining || 0,
        ],
        backgroundColor: [
          'hsl(145, 65%, 40%)',
          'hsl(214, 67%, 50%)',
          'hsl(0, 70%, 45%)',
        ],
        borderColor: [
          'hsl(145, 55%, 75%)',
          'hsl(214, 65%, 85%)',
          'hsl(0, 75%, 75%)',
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
        <CardTitle>Improvement Trends</CardTitle>
        <CardDescription>Student performance trajectory</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <Pie data={chartData} options={options} />
        </div>
      </CardContent>
    </Card>
  );
};

export default ImprovementTrendChart;