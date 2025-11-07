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

export const EngagementFactorsChart = ({ data }) => {
  // Group by department and calculate average engagement factors
  const deptData = data.reduce((acc, record) => {
    const dept = record.department;
    if (!acc[dept]) {
      acc[dept] = {
        assignments: 0,
        logins: 0,
        attendance: 0,
        count: 0,
      };
    }
    acc[dept].assignments += parseFloat(record.assignments_submitted || 0);
    acc[dept].logins += parseFloat(record.lms_logins || 0);
    acc[dept].attendance += parseFloat(record.attendance_rate || 0);
    acc[dept].count += 1;
    return acc;
  }, {});

  const departments = Object.keys(deptData);
  const avgAssignments = departments.map((dept) => (deptData[dept].assignments / deptData[dept].count).toFixed(1));
  const avgLogins = departments.map((dept) => (deptData[dept].logins / deptData[dept].count).toFixed(1));
  const avgAttendance = departments.map((dept) => (deptData[dept].attendance / deptData[dept].count).toFixed(1));

  const chartData = {
    labels: departments,
    datasets: [
      {
        label: 'Assignments',
        data: avgAssignments,
        backgroundColor: 'hsl(220, 60%, 25%)',
        stack: 'Stack 0',
      },
      {
        label: 'LMS Logins',
        data: avgLogins,
        backgroundColor: 'hsl(220, 50%, 35%)',
        stack: 'Stack 0',
      },
      {
        label: 'Attendance %',
        data: avgAttendance,
        backgroundColor: 'hsl(220, 40%, 45%)',
        stack: 'Stack 0',
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
      },
    },
    scales: {
      y: {
        stacked: true,
        beginAtZero: true,
        grid: {
          color: 'hsl(215, 20%, 88%)',
        },
      },
      x: {
        stacked: true,
        grid: {
          display: false,
        },
      },
    },
  };

  return (
    <Card className="card-hover col-span-1 lg:col-span-2">
      <CardHeader>
        <CardTitle>Engagement Factors by Department</CardTitle>
        <CardDescription>Stacked view of key engagement metrics</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <Bar data={chartData} options={options} />
        </div>
      </CardContent>
    </Card>
  );
};

export default EngagementFactorsChart;