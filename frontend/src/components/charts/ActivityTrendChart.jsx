import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export const ActivityTrendChart = ({ data }) => {
  // Group by week and calculate average activity score
  const weeklyData = data.reduce((acc, record) => {
    const week = record.week_number;
    if (!acc[week]) {
      acc[week] = { sum: 0, count: 0 };
    }
    acc[week].sum += record.total_activity_score;
    acc[week].count += 1;
    return acc;
  }, {});

  const weeks = Object.keys(weeklyData).sort((a, b) => a - b);
  const avgScores = weeks.map((week) => (weeklyData[week].sum / weeklyData[week].count).toFixed(1));

  const chartData = {
    labels: weeks.map((w) => `Week ${w}`),
    datasets: [
      {
        label: 'Average Activity Score',
        data: avgScores,
        borderColor: 'hsl(220, 60%, 25%)',
        backgroundColor: 'hsl(220, 60%, 25%, 0.1)',
        fill: true,
        tension: 0.4,
        pointRadius: 4,
        pointHoverRadius: 6,
        pointBackgroundColor: 'hsl(220, 60%, 25%)',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            return `${context.dataset.label}: ${context.parsed.y}%`;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        ticks: {
          callback: function (value) {
            return value + '%';
          },
        },
        grid: {
          color: 'hsl(215, 20%, 88%)',
        },
      },
      x: {
        grid: {
          display: false,
        },
      },
    },
  };

  return (
    <Card className="card-hover col-span-1">
      <CardHeader>
        <CardTitle>Activity Trend Over Time</CardTitle>
        <CardDescription>Average engagement score by week</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <Line data={chartData} options={options} />
        </div>
      </CardContent>
    </Card>
  );
};

export default ActivityTrendChart;