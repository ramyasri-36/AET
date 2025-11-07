import { useState, useEffect } from 'react';
import { loadExcelData } from '@/utils/dataLoader';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search } from 'lucide-react';
import StudentProfileModal from '@/components/StudentProfileModal';

const Students = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStudent, setSelectedStudent] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (searchTerm) {
      const filtered = data.filter(
        (student) =>
          student.student_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          student.student_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
          student.department.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredData(filtered);
    } else {
      setFilteredData(data);
    }
  }, [searchTerm, data]);

  const loadData = async () => {
    setLoading(true);
    try {
      const excelData = await loadExcelData('https://customer-assets.emergentagent.com/job_82f7232b-0c6c-492d-ab18-173cf836f765/artifacts/qnll90go_academic_engagement_dataset.xlsx');
      // Group by student and get latest record for each
      const studentMap = {};
      excelData.forEach(record => {
        if (!studentMap[record.student_id] || record.week_number > studentMap[record.student_id].week_number) {
          studentMap[record.student_id] = record;
        }
      });
      const students = Object.values(studentMap);
      setData(students);
      setFilteredData(students);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="text-center space-y-4">
          <div className="animate-spin h-12 w-12 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
          <p className="text-muted-foreground">Loading student profiles...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-3xl sm:text-4xl font-bold text-foreground">Student Profiles</h1>
        <p className="text-muted-foreground mt-2">Search and view detailed student engagement data</p>
      </div>

      {/* Search Bar */}
      <Card>
        <CardHeader>
          <CardTitle>Search Students</CardTitle>
          <CardDescription>Find students by name, ID, or department</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search by name, student ID, or department..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <p className="text-sm text-muted-foreground mt-2">
            Showing {filteredData.length} of {data.length} students
          </p>
        </CardContent>
      </Card>

      {/* Students Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filteredData.map((student) => (
          <Card
            key={student.student_id}
            className="card-hover cursor-pointer"
            onClick={() => setSelectedStudent(student)}
          >
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg">{student.student_name}</CardTitle>
                  <CardDescription className="mt-1">{student.student_id}</CardDescription>
                </div>
                <Badge className={getAlertBadgeClass(student.alert_level)}>
                  {student.alert_level}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Department:</span>
                  <span className="font-medium">{student.department}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">GPA:</span>
                  <span className="font-medium">{parseFloat(student.gpa).toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Activity Score:</span>
                  <span className="font-medium">{student.total_activity_score.toFixed(1)}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Attendance:</span>
                  <span className="font-medium">{student.attendance_rate}%</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredData.length === 0 && (
        <Card>
          <CardContent className="py-12">
            <div className="text-center text-muted-foreground">
              <p>No students found matching your search.</p>
            </div>
          </CardContent>
        </Card>
      )}

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

export default Students;