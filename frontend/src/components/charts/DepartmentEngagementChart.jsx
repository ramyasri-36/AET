import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export const DepartmentEngagementChart = ({ data }) => {
  // Group by department and calculate average scores
  const deptData = data.reduce((acc, record) => {
    const dept = record.department;
    if (!acc[dept]) {
      acc[dept] = { totalScore: 0, totalGPA: 0, count: 0 };
    }
    acc[dept].totalScore += record.total_activity_score;
    acc[dept].totalGPA += parseFloat(record.gpa);
    acc[dept].count += 1;
    return acc;
  }, {});

  const departments = Object.keys(deptData);
  const avgScores = departments.map((dept) => (deptData[dept].totalScore / deptData[dept].count).toFixed(1));
  const avgGPAs = departments.map((dept) => ((deptData[dept].totalGPA / deptData[dept].count) * 25).toFixed(1)); // Scale GPA to 0-100

  const chartData = {
    labels: departments,
    datasets: [
      {
        label: 'Avg Activity Score',
        data: avgScores,
        backgroundColor: 'hsl(214, 67%, 50%)',
        borderRadius: 4,
      },
      {
        label: 'Avg GPA (scaled)',
        data: avgGPAs,
        backgroundColor: 'hsl(145, 65%, 40%)',
        borderRadius: 4,
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
    <Card className="card-hover col-span-1 lg:col-span-2">
      <CardHeader>
        <CardTitle>Department-wise Performance</CardTitle>
        <CardDescription>Average engagement and GPA by department</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <Bar data={chartData} options={options} />
        </div>
      </CardContent>
    </Card>
  );
};

export default DepartmentEngagementChart;