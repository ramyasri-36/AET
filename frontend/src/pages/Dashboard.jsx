import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { loadExcelData, clearDataCache } from '@/utils/dataLoader';
import { Users, TrendingUp, ClipboardCheck, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import AlertDistributionChart from '@/components/charts/AlertDistributionChart';
import ActivityTrendChart from '@/components/charts/ActivityTrendChart';
import DepartmentEngagementChart from '@/components/charts/DepartmentEngagementChart';
import EngagementFactorsChart from '@/components/charts/EngagementFactorsChart';
import ImprovementTrendChart from '@/components/charts/ImprovementTrendChart';
import TopRiskStudentsTable from '@/components/TopRiskStudentsTable';

const Dashboard = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalStudents: 0,
    avgGPA: 0,
    avgAttendance: 0,
    avgAssignments: 0,
    greenPercent: 0,
    yellowPercent: 0,
    redPercent: 0,
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      // Try to load the uploaded file or use mock data
      const excelData = await loadExcelData('https://customer-assets.emergentagent.com/job_82f7232b-0c6c-492d-ab18-173cf836f765/artifacts/qnll90go_academic_engagement_dataset.xlsx');
      setData(excelData);
      calculateStats(excelData);
      toast.success('Data loaded successfully');
    } catch (error) {
      console.error('Error loading data:', error);
      toast.error('Error loading data, using mock data');
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (data) => {
    if (!data || data.length === 0) return;

    const totalStudents = data.length;
    const avgGPA = (data.reduce((sum, s) => sum + parseFloat(s.gpa || 0), 0) / totalStudents).toFixed(2);
    const avgAttendance = (data.reduce((sum, s) => sum + parseFloat(s.attendance_rate || 0), 0) / totalStudents).toFixed(1);
    const avgAssignments = (data.reduce((sum, s) => sum + parseFloat(s.assignments_submitted || 0), 0) / totalStudents).toFixed(1);

    const alertCounts = data.reduce(
      (acc, s) => {
        acc[s.alert_level] = (acc[s.alert_level] || 0) + 1;
        return acc;
      },
      {}
    );

    const greenPercent = ((alertCounts.Green || 0) / totalStudents * 100).toFixed(1);
    const yellowPercent = ((alertCounts.Yellow || 0) / totalStudents * 100).toFixed(1);
    const redPercent = ((alertCounts.Red || 0) / totalStudents * 100).toFixed(1);

    setStats({
      totalStudents,
      avgGPA,
      avgAttendance,
      avgAssignments,
      greenPercent,
      yellowPercent,
      redPercent,
    });
  };

  const handleRefresh = () => {
    clearDataCache();
    loadData();
    toast.info('Refreshing data...');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="text-center space-y-4">
          <div className="animate-spin h-12 w-12 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
          <p className="text-muted-foreground">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground">Academic Engagement Dashboard</h1>
          <p className="text-muted-foreground mt-2">Early risk detection and student performance tracking</p>
        </div>
        <Button onClick={handleRefresh} variant="outline" className="gap-2">
          <TrendingUp className="h-4 w-4" />
          Refresh Data
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="card-hover">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalStudents}</div>
            <p className="text-xs text-muted-foreground mt-1">Enrolled this term</p>
          </CardContent>
        </Card>

        <Card className="card-hover">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average GPA</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.avgGPA}</div>
            <p className="text-xs text-muted-foreground mt-1">Out of 4.0</p>
          </CardContent>
        </Card>

        <Card className="card-hover">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Attendance</CardTitle>
            <ClipboardCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.avgAttendance}%</div>
            <p className="text-xs text-muted-foreground mt-1">Class participation rate</p>
          </CardContent>
        </Card>

        <Card className="card-hover">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Assignments</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.avgAssignments}</div>
            <p className="text-xs text-muted-foreground mt-1">Submissions per week</p>
          </CardContent>
        </Card>
      </div>

      {/* Alert Distribution Summary */}
      <Card className="card-hover">
        <CardHeader>
          <CardTitle>Alert Level Distribution</CardTitle>
          <CardDescription>Student risk categories breakdown</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="flex items-center gap-3 p-4 rounded-lg bg-[hsl(var(--success-light))] border border-[hsl(var(--success-border))]">
              <div className="h-12 w-12 rounded-full bg-[hsl(var(--success))] flex items-center justify-center text-white font-bold text-lg">
                {stats.greenPercent}%
              </div>
              <div>
                <p className="font-semibold text-[hsl(var(--success))]">✅ Green - Low Risk</p>
                <p className="text-sm text-muted-foreground">Performing well</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 rounded-lg bg-[hsl(var(--warning-light))] border border-[hsl(var(--warning-border))]">
              <div className="h-12 w-12 rounded-full bg-[hsl(var(--warning))] flex items-center justify-center text-[hsl(var(--warning-foreground))] font-bold text-lg">
                {stats.yellowPercent}%
              </div>
              <div>
                <p className="font-semibold text-[hsl(var(--warning-foreground))]">⚠️ Yellow - Medium Risk</p>
                <p className="text-sm text-muted-foreground">Needs attention</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 rounded-lg bg-[hsl(var(--danger-light))] border border-[hsl(var(--danger-border))]">
              <div className="h-12 w-12 rounded-full bg-[hsl(var(--danger))] flex items-center justify-center text-white font-bold text-lg">
                {stats.redPercent}%
              </div>
              <div>
                <p className="font-semibold text-[hsl(var(--danger))]">🔴 Red - High Risk</p>
                <p className="text-sm text-muted-foreground">Urgent intervention</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Charts Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        <AlertDistributionChart data={data} />
        <ActivityTrendChart data={data} />
        <DepartmentEngagementChart data={data} />
        <EngagementFactorsChart data={data} />
        <ImprovementTrendChart data={data} />
      </div>

      {/* Top At-Risk Students */}
      <TopRiskStudentsTable data={data} />
    </div>
  );
};

export default Dashboard;