import { useState, useEffect } from 'react';
import { loadExcelData, clearDataCache, exportAdvisorComments } from '@/utils/dataLoader';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RefreshCw, Download, Database, TrendingUp, Users, BookOpen } from 'lucide-react';
import { toast } from 'sonner';
import TermComparisonChart from '@/components/charts/TermComparisonChart';

const DataSummary = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({});

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const excelData = await loadExcelData('/academic_engagement_dataset.xlsx');
      setData(excelData);
      calculateStats(excelData);
      toast.success('Data loaded successfully');
    } catch (error) {
      console.error('Error loading data:', error);
      toast.error('Error loading data');
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (data) => {
    if (!data || data.length === 0) return;

    const totalRows = data.length;
    const departments = [...new Set(data.map((s) => s.department))];
    const terms = [...new Set(data.map((s) => s.term))];
    const avgCreditHours = (data.reduce((sum, s) => sum + parseFloat(s.credit_hours || 0), 0) / totalRows).toFixed(1);
    const avgAttendance = (data.reduce((sum, s) => sum + parseFloat(s.attendance_rate || 0), 0) / totalRows).toFixed(1);
    const avgAssignments = (data.reduce((sum, s) => sum + parseFloat(s.assignments_submitted || 0), 0) / totalRows).toFixed(1);
    const avgLibraryVisits = (data.reduce((sum, s) => sum + parseFloat(s.library_visits || 0), 0) / totalRows).toFixed(1);
    const avgLMSLogins = (data.reduce((sum, s) => sum + parseFloat(s.lms_logins || 0), 0) / totalRows).toFixed(1);
    const avgActivityScore = (data.reduce((sum, s) => sum + parseFloat(s.total_activity_score || 0), 0) / totalRows).toFixed(1);

    setStats({
      totalRows,
      departments: departments.length,
      terms: terms.length,
      avgCreditHours,
      avgAttendance,
      avgAssignments,
      avgLibraryVisits,
      avgLMSLogins,
      avgActivityScore,
    });
  };

  const handleRecalculate = () => {
    clearDataCache();
    loadData();
    toast.info('Recalculating alerts and refreshing data...');
  };

  const handleExportComments = () => {
    exportAdvisorComments(data);
    toast.success('Advisor comments exported successfully');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="text-center space-y-4">
          <div className="animate-spin h-12 w-12 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
          <p className="text-muted-foreground">Loading data summary...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground">Data Summary</h1>
          <p className="text-muted-foreground mt-2">Overview of dataset statistics and trends</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={handleExportComments} variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            Export Comments
          </Button>
          <Button onClick={handleRecalculate} className="gap-2">
            <RefreshCw className="h-4 w-4" />
            Recalculate Alerts
          </Button>
        </div>
      </div>

      {/* Dataset Statistics */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="card-hover">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Records</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalRows}</div>
            <p className="text-xs text-muted-foreground mt-1">Engagement records</p>
          </CardContent>
        </Card>

        <Card className="card-hover">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Departments</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.departments}</div>
            <p className="text-xs text-muted-foreground mt-1">Academic departments</p>
          </CardContent>
        </Card>

        <Card className="card-hover">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Terms</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.terms}</div>
            <p className="text-xs text-muted-foreground mt-1">Academic terms</p>
          </CardContent>
        </Card>

        <Card className="card-hover">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Credit Hours</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.avgCreditHours}</div>
            <p className="text-xs text-muted-foreground mt-1">Per student</p>
          </CardContent>
        </Card>
      </div>

      {/* Engagement Metrics */}
      <Card className="card-hover">
        <CardHeader>
          <CardTitle>Average Engagement Metrics</CardTitle>
          <CardDescription>Overall student engagement across all records</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground">Attendance Rate</span>
                <span className="text-lg font-bold">{stats.avgAttendance}%</span>
              </div>
              <div className="h-2 rounded-full bg-muted overflow-hidden">
                <div
                  className="h-full bg-[hsl(var(--primary))]" 
                  style={{ width: `${stats.avgAttendance}%` }}
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground">Activity Score</span>
                <span className="text-lg font-bold">{stats.avgActivityScore}%</span>
              </div>
              <div className="h-2 rounded-full bg-muted overflow-hidden">
                <div
                  className="h-full bg-[hsl(var(--chart-2))]" 
                  style={{ width: `${stats.avgActivityScore}%` }}
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground">Assignments</span>
                <span className="text-lg font-bold">{stats.avgAssignments} / 5</span>
              </div>
              <div className="h-2 rounded-full bg-muted overflow-hidden">
                <div
                  className="h-full bg-[hsl(var(--chart-3))]" 
                  style={{ width: `${(stats.avgAssignments / 5) * 100}%` }}
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground">LMS Logins</span>
                <span className="text-lg font-bold">{stats.avgLMSLogins} / 20</span>
              </div>
              <div className="h-2 rounded-full bg-muted overflow-hidden">
                <div
                  className="h-full bg-[hsl(var(--chart-4))]" 
                  style={{ width: `${(stats.avgLMSLogins / 20) * 100}%` }}
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground">Library Visits</span>
                <span className="text-lg font-bold">{stats.avgLibraryVisits} / 10</span>
              </div>
              <div className="h-2 rounded-full bg-muted overflow-hidden">
                <div
                  className="h-full bg-[hsl(var(--chart-5))]" 
                  style={{ width: `${(stats.avgLibraryVisits / 10) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Term Comparison Chart */}
      <TermComparisonChart data={data} />

      {/* Data Information */}
      <Card className="card-hover">
        <CardHeader>
          <CardTitle>Dataset Information</CardTitle>
          <CardDescription>Details about the academic engagement dataset</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 text-sm">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <h3 className="font-semibold mb-2">Data Sources</h3>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                  <li>Learning Management System (LMS)</li>
                  <li>Student Information System (SIS)</li>
                  <li>Library Management System</li>
                  <li>Event Attendance Records</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Key Metrics</h3>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                  <li>GPA and Academic Performance</li>
                  <li>Class Attendance Rates</li>
                  <li>Assignment Submission Patterns</li>
                  <li>Campus Engagement Activities</li>
                </ul>
              </div>
            </div>

            <div className="pt-4 border-t border-border">
              <h3 className="font-semibold mb-2">Activity Score Calculation</h3>
              <p className="text-muted-foreground">
                The total activity score is calculated using a weighted formula:
              </p>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground mt-2">
                <li>20% - Assignments Submitted (out of 5 per week)</li>
                <li>20% - Attendance Rate (percentage)</li>
                <li>15% - LMS Logins (out of 20 per week)</li>
                <li>15% - Library Visits (out of 10 per week)</li>
                <li>10% - Events Attended (out of 5 per week)</li>
                <li>10% - Office Hours Visits (out of 5 per week)</li>
                <li>10% - Discussion Posts (out of 10 per week)</li>
              </ul>
            </div>

            <div className="pt-4 border-t border-border">
              <h3 className="font-semibold mb-2">Alert Level Thresholds</h3>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-[hsl(var(--success))]"></div>
                  <span className="text-muted-foreground">Green (Low Risk): Activity Score ≥ 70%</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-[hsl(var(--warning))]"></div>
                  <span className="text-muted-foreground">Yellow (Medium Risk): 40% ≤ Activity Score < 70%</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-[hsl(var(--danger))]"></div>
                  <span className="text-muted-foreground">Red (High Risk): Activity Score < 40%</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DataSummary;