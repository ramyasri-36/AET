import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import StudentProfileModal from './StudentProfileModal';

export const TopRiskStudentsTable = ({ data }) => {
  const [selectedStudent, setSelectedStudent] = useState(null);

  // Get top 10 at-risk students (lowest activity scores)
  const topRiskStudents = [...data]
    .sort((a, b) => a.total_activity_score - b.total_activity_score)
    .slice(0, 10);

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

  return (
    <>
      <Card className="card-hover">
        <CardHeader>
          <CardTitle>Top 10 At-Risk Students</CardTitle>
          <CardDescription>Students with lowest activity scores requiring immediate attention</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left p-3 font-semibold">Rank</th>
                  <th className="text-left p-3 font-semibold">Student ID</th>
                  <th className="text-left p-3 font-semibold">Name</th>
                  <th className="text-left p-3 font-semibold">Department</th>
                  <th className="text-left p-3 font-semibold">GPA</th>
                  <th className="text-left p-3 font-semibold">Alert Level</th>
                  <th className="text-left p-3 font-semibold">Activity Score</th>
                </tr>
              </thead>
              <tbody>
                {topRiskStudents.map((student, index) => (
                  <tr
                    key={student.student_id}
                    className={`border-b border-border cursor-pointer transition-colors ${getAlertRowClass(student.alert_level)}`}
                    onClick={() => setSelectedStudent(student)}
                  >
                    <td className="p-3 font-bold text-muted-foreground">#{index + 1}</td>
                    <td className="p-3 font-mono text-sm">{student.student_id}</td>
                    <td className="p-3 font-medium">{student.student_name}</td>
                    <td className="p-3 text-sm">{student.department}</td>
                    <td className="p-3 font-medium">{parseFloat(student.gpa).toFixed(2)}</td>
                    <td className="p-3">
                      <Badge className={getAlertBadgeClass(student.alert_level)}>
                        {student.alert_level}
                      </Badge>
                    </td>
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <span className="font-bold">{student.total_activity_score.toFixed(1)}%</span>
                        <div className="flex-1 max-w-[100px] h-2 bg-muted rounded-full overflow-hidden">
                          <div
                            className={`h-full ${
                              student.alert_level === 'Green'
                                ? 'bg-[hsl(var(--success))]'
                                : student.alert_level === 'Yellow'
                                ? 'bg-[hsl(var(--warning))]'
                                : 'bg-[hsl(var(--danger))]'
                            }`}
                            style={{ width: `${student.total_activity_score}%` }}
                          />
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
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
    </>
  );
};

export default TopRiskStudentsTable;