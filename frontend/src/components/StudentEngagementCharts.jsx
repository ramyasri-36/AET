import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Bar, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export const StudentEngagementCharts = ({ student }) => {
  // Mock weekly data for individual student (in real scenario, this would come from historical records)
  const weeks = Array.from({ length: student.week_number }, (_, i) => i + 1);
  
  // Simulate assignment submission pattern
  const assignmentsData = weeks.map(() => Math.floor(Math.random() * 5));
  assignmentsData[assignmentsData.length - 1] = student.assignments_submitted;
  
  // Simulate attendance pattern
  const attendanceData = weeks.map(() => 60 + Math.random() * 40);
  attendanceData[attendanceData.length - 1] = student.attendance_rate;

  // LMS Logins vs Library Visits
  const lmsData = weeks.map(() => Math.floor(Math.random() * 20));
  lmsData[lmsData.length - 1] = student.lms_logins;
  
  const libraryData = weeks.map(() => Math.floor(Math.random() * 10));
  libraryData[libraryData.length - 1] = student.library_visits;

  // Assignments Chart
  const assignmentsChartData = {
    labels: weeks.map((w) => `W${w}`),
    datasets: [
      {
        label: 'Assignments Submitted',
        data: assignmentsData,
        backgroundColor: 'hsl(220, 60%, 25%)',
        borderRadius: 4,
      },
    ],
  };

  // Attendance Chart
  const attendanceChartData = {
    labels: weeks.map((w) => `W${w}`),
    datasets: [
      {
        label: 'Attendance Rate',
        data: attendanceData,
        borderColor: 'hsl(220, 50%, 35%)',
        backgroundColor: 'hsl(220, 50%, 35%, 0.1)',
        fill: true,
        tension: 0.4,
        pointRadius: 3,
      },
    ],
  };

  // LMS vs Library Chart
  const comparisonChartData = {
    labels: weeks.map((w) => `W${w}`),
    datasets: [
      {
        label: 'LMS Logins',
        data: lmsData,
        backgroundColor: 'hsl(214, 67%, 50%)',
        borderRadius: 4,
      },
      {
        label: 'Library Visits',
        data: libraryData,
        backgroundColor: 'hsl(270, 50%, 50%)',
        borderRadius: 4,
      },
    ],
  };

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
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

  const lineOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
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

  const comparisonOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          padding: 10,
          font: {
            size: 11,
            family: 'Inter',
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
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
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Assignments Over Time</CardTitle>
          <CardDescription>Weekly submission pattern</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[200px]">
            <Bar data={assignmentsChartData} options={barOptions} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Attendance Trend</CardTitle>
          <CardDescription>Weekly attendance percentage</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[200px]">
            <Line data={attendanceChartData} options={lineOptions} />
          </div>
        </CardContent>
      </Card>

      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle className="text-base">LMS Logins vs Library Visits</CardTitle>
          <CardDescription>Comparison of digital and physical engagement</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[200px]">
            <Bar data={comparisonChartData} options={comparisonOptions} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StudentEngagementCharts;