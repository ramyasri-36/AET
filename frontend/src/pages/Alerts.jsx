import { useState, useEffect } from 'react';
import { loadExcelData, exportToCSV } from '@/utils/dataLoader';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Download, Search } from 'lucide-react';
import { toast } from 'sonner';
import StudentProfileModal from '@/components/StudentProfileModal';

const Alerts = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [alertFilter, setAlertFilter] = useState('all');
  const [gpaFilter, setGpaFilter] = useState('all');
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [sortColumn, setSortColumn] = useState('total_activity_score');
  const [sortDirection, setSortDirection] = useState('asc');

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [data, searchTerm, departmentFilter, alertFilter, gpaFilter, sortColumn, sortDirection]);

  const loadData = async () => {
    setLoading(true);
    try {
      const excelData = await loadExcelData('/academic_engagement_dataset.xlsx');
      
      // Group by student and get latest record - optimized
      const studentMap = new Map();
      excelData.forEach(record => {
        const existingRecord = studentMap.get(record.student_id);
        if (!existingRecord || record.week_number > existingRecord.week_number) {
          studentMap.set(record.student_id, record);
        }
      });
      
      const students = Array.from(studentMap.values());
      console.log(`Loaded ${students.length} unique students for alerts`);
      
      setData(students);
      setFilteredData(students);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...data];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (s) =>
          s.student_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          s.student_id.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Department filter
    if (departmentFilter !== 'all') {
      filtered = filtered.filter((s) => s.department === departmentFilter);
    }

    // Alert level filter
    if (alertFilter !== 'all') {
      filtered = filtered.filter((s) => s.alert_level === alertFilter);
    }

    // GPA filter
    if (gpaFilter !== 'all') {
      const gpa = parseFloat(gpaFilter);
      if (gpaFilter === '3.5') {
        filtered = filtered.filter((s) => parseFloat(s.gpa) >= 3.5);
      } else if (gpaFilter === '3.0') {
        filtered = filtered.filter((s) => parseFloat(s.gpa) >= 3.0 && parseFloat(s.gpa) < 3.5);
      } else if (gpaFilter === '2.5') {
        filtered = filtered.filter((s) => parseFloat(s.gpa) >= 2.5 && parseFloat(s.gpa) < 3.0);
      } else if (gpaFilter === '2.0') {
        filtered = filtered.filter((s) => parseFloat(s.gpa) < 2.5);
      }
    }

    // Sort
    filtered.sort((a, b) => {
      let aVal = a[sortColumn];
      let bVal = b[sortColumn];

      if (typeof aVal === 'string') {
        aVal = aVal.toLowerCase();
        bVal = bVal.toLowerCase();
      }

      if (sortDirection === 'asc') {
        return aVal > bVal ? 1 : -1;
      } else {
        return aVal < bVal ? 1 : -1;
      }
    });

    setFilteredData(filtered);
  };

  const handleSort = (column) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  const handleExport = () => {
    exportToCSV(filteredData, `alerts_${new Date().toISOString().split('T')[0]}.csv`);
    toast.success('Data exported successfully');
  };

  const getAlertBadgeClass = (alertLevel) => {
    switch (alertLevel) {
      case 'Green':
        return 'alert-badge-green';
      case 'Yellow':
        return 'alert-badge-yellow';
      case 'Red':
        return 'alert-badge-red';
      default:
        return 'bg-muted';
    }
  };

  const getAlertRowClass = (alertLevel) => {
    switch (alertLevel) {
      case 'Green':
        return 'hover:bg-[hsl(var(--success-light))]';
      case 'Yellow':
        return 'hover:bg-[hsl(var(--warning-light))]';
      case 'Red':
        return 'hover:bg-[hsl(var(--danger-light))]';
      default:
        return '';
    }
  };

  const getTrendIcon = (trend) => {
    switch (trend) {
      case 'Improving':
        return '↗️';
      case 'Declining':
        return '↘️';
      case 'Stable':
        return '➡️';
      default:
        return '';
    }
  };

  const departments = [...new Set(data.map((s) => s.department))];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="text-center space-y-4">
          <div className="animate-spin h-12 w-12 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
          <p className="text-muted-foreground">Loading alerts data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground">Alerts Center</h1>
          <p className="text-muted-foreground mt-2">Monitor and filter at-risk students</p>
        </div>
        <Button onClick={handleExport} className="gap-2">
          <Download className="h-4 w-4" />
          Export CSV
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
          <CardDescription>Refine your student alert view</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search students..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Department Filter */}
            <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
              <SelectTrigger>
                <SelectValue placeholder="All Departments" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Departments</SelectItem>
                {departments.map((dept) => (
                  <SelectItem key={dept} value={dept}>
                    {dept}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Alert Level Filter */}
            <Select value={alertFilter} onValueChange={setAlertFilter}>
              <SelectTrigger>
                <SelectValue placeholder="All Alert Levels" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Alert Levels</SelectItem>
                <SelectItem value="Red">Red - High Risk</SelectItem>
                <SelectItem value="Yellow">Yellow - Medium Risk</SelectItem>
                <SelectItem value="Green">Green - Low Risk</SelectItem>
              </SelectContent>
            </Select>

            {/* GPA Filter */}
            <Select value={gpaFilter} onValueChange={setGpaFilter}>
              <SelectTrigger>
                <SelectValue placeholder="All GPA Ranges" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All GPA Ranges</SelectItem>
                <SelectItem value="3.5">3.5+ (Excellent)</SelectItem>
                <SelectItem value="3.0">3.0-3.5 (Good)</SelectItem>
                <SelectItem value="2.5">2.5-3.0 (Average)</SelectItem>
                <SelectItem value="2.0">Below 2.5 (Needs Help)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <p className="text-sm text-muted-foreground mt-4">
            Showing {filteredData.length} of {data.length} students
          </p>
        </CardContent>
      </Card>

      {/* Alerts Table */}
      <Card>
        <CardHeader>
          <CardTitle>Student Alerts</CardTitle>
          <CardDescription>Click on any row to view detailed student profile</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th
                    className="text-left p-3 font-semibold cursor-pointer hover:bg-muted/50"
                    onClick={() => handleSort('student_id')}
                  >
                    Student ID {sortColumn === 'student_id' && (sortDirection === 'asc' ? '↑' : '↓')}
                  </th>
                  <th
                    className="text-left p-3 font-semibold cursor-pointer hover:bg-muted/50"
                    onClick={() => handleSort('student_name')}
                  >
                    Name {sortColumn === 'student_name' && (sortDirection === 'asc' ? '↑' : '↓')}
                  </th>
                  <th
                    className="text-left p-3 font-semibold cursor-pointer hover:bg-muted/50"
                    onClick={() => handleSort('department')}
                  >
                    Department {sortColumn === 'department' && (sortDirection === 'asc' ? '↑' : '↓')}
                  </th>
                  <th
                    className="text-left p-3 font-semibold cursor-pointer hover:bg-muted/50"
                    onClick={() => handleSort('gpa')}
                  >
                    GPA {sortColumn === 'gpa' && (sortDirection === 'asc' ? '↑' : '↓')}
                  </th>
                  <th
                    className="text-left p-3 font-semibold cursor-pointer hover:bg-muted/50"
                    onClick={() => handleSort('alert_level')}
                  >
                    Alert Level {sortColumn === 'alert_level' && (sortDirection === 'asc' ? '↑' : '↓')}
                  </th>
                  <th
                    className="text-left p-3 font-semibold cursor-pointer hover:bg-muted/50"
                    onClick={() => handleSort('total_activity_score')}
                  >
                    Activity Score {sortColumn === 'total_activity_score' && (sortDirection === 'asc' ? '↑' : '↓')}
                  </th>
                  <th
                    className="text-left p-3 font-semibold cursor-pointer hover:bg-muted/50"
                    onClick={() => handleSort('improvement_trend')}
                  >
                    Trend {sortColumn === 'improvement_trend' && (sortDirection === 'asc' ? '↑' : '↓')}
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredData.map((student) => (
                  <tr
                    key={student.student_id}
                    className={`border-b border-border cursor-pointer transition-colors ${getAlertRowClass(student.alert_level)}`}
                    onClick={() => setSelectedStudent(student)}
                  >
                    <td className="p-3 font-mono text-sm">{student.student_id}</td>
                    <td className="p-3 font-medium">{student.student_name}</td>
                    <td className="p-3 text-sm">{student.department}</td>
                    <td className="p-3 font-medium">{parseFloat(student.gpa).toFixed(2)}</td>
                    <td className="p-3">
                      <Badge className={getAlertBadgeClass(student.alert_level)}>
                        {student.alert_level}
                      </Badge>
                    </td>
                    <td className="p-3 font-medium">{student.total_activity_score.toFixed(1)}%</td>
                    <td className="p-3">
                      <span className="text-sm">
                        {getTrendIcon(student.improvement_trend)} {student.improvement_trend}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filteredData.length === 0 && (
              <div className="text-center py-12 text-muted-foreground">
                <p>No students found matching your filters.</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Student Profile Modal */}
      {selectedStudent && (
        <StudentProfileModal
          student={selectedStudent}
          isOpen={!!selectedStudent}
          onClose={() => setSelectedStudent(null)}
        />
      )}
    </div>
  );
};

export default Alerts;