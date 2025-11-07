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
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

export const TermComparisonChart = ({ data }) => {
  // Group by term and calculate average scores
  const termData = data.reduce((acc, record) => {
    const term = record.term;
    if (!acc[term]) {
      acc[term] = { totalScore: 0, totalGPA: 0, totalAttendance: 0, count: 0 };
    }
    acc[term].totalScore += record.total_activity_score;
    acc[term].totalGPA += parseFloat(record.gpa);
    acc[term].totalAttendance += parseFloat(record.attendance_rate);
    acc[term].count += 1;
    return acc;
  }, {});

  const terms = Object.keys(termData).sort();
  const avgScores = terms.map((term) => (termData[term].totalScore / termData[term].count).toFixed(1));
  const avgGPAs = terms.map((term) => ((termData[term].totalGPA / termData[term].count) * 25).toFixed(1)); // Scale to 0-100
  const avgAttendance = terms.map((term) => (termData[term].totalAttendance / termData[term].count).toFixed(1));

  const chartData = {
    labels: terms,
    datasets: [
      {
        label: 'Activity Score',
        data: avgScores,
        borderColor: 'hsl(220, 60%, 25%)',
        backgroundColor: 'hsl(220, 60%, 25%, 0.1)',
        tension: 0.4,
        pointRadius: 5,
        pointHoverRadius: 7,
      },
      {
        label: 'GPA (scaled)',
        data: avgGPAs,
        borderColor: 'hsl(220, 50%, 35%)',
        backgroundColor: 'hsl(220, 50%, 35%, 0.1)',
        tension: 0.4,
        pointRadius: 5,
        pointHoverRadius: 7,
      },
      {
        label: 'Attendance',
        data: avgAttendance,
        borderColor: 'hsl(220, 40%, 45%)',
        backgroundColor: 'hsl(220, 40%, 45%, 0.1)',
        tension: 0.4,
        pointRadius: 5,
        pointHoverRadius: 7,
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
        mode: 'index',
        intersect: false,
        callbacks: {
          label: function (context) {
            const label = context.dataset.label;
            const value = context.parsed.y;
            if (label.includes('GPA')) {
              return `${label}: ${(value / 25).toFixed(2)} / 4.0`;
            }
            return `${label}: ${value}%`;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
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
    <Card className="card-hover">
      <CardHeader>
        <CardTitle>Term Comparison</CardTitle>
        <CardDescription>Academic engagement trends across terms</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <Line data={chartData} options={options} />
        </div>
      </CardContent>
    </Card>
  );
};

export default TermComparisonChart;