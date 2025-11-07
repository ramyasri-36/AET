import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { getAdvisorComment, saveAdvisorComment } from '@/utils/dataLoader';
import { toast } from 'sonner';
import { User, GraduationCap, TrendingUp, Calendar, BookOpen, Activity, Save } from 'lucide-react';
import StudentEngagementCharts from './StudentEngagementCharts';

export const StudentProfileModal = ({ student, isOpen, onClose }) => {
  const [comment, setComment] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (student) {
      const savedComment = getAdvisorComment(student.student_id);
      setComment(savedComment || student.advisor_comments || '');
    }
  }, [student]);

  const handleSaveComment = () => {
    setIsSaving(true);
    saveAdvisorComment(student.student_id, comment);
    setTimeout(() => {
      setIsSaving(false);
      toast.success('Advisor comment saved successfully');
    }, 500);
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

  const getTrendIcon = (trend) => {
    switch (trend) {
      case 'Improving':
        return { icon: '↗️', color: 'text-[hsl(var(--success))]' };
      case 'Declining':
        return { icon: '↘️', color: 'text-[hsl(var(--danger))]' };
      case 'Stable':
        return { icon: '➡️', color: 'text-[hsl(var(--primary))]' };
      default:
        return { icon: '', color: '' };
    }
  };

  const trendInfo = getTrendIcon(student?.improvement_trend);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Student Profile</DialogTitle>
          <DialogDescription>Detailed engagement and performance data</DialogDescription>
        </DialogHeader>

        {student && (
          <div className="space-y-6">
            {/* Student Info Card */}
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                      <User className="h-8 w-8 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-xl">{student.student_name}</CardTitle>
                      <CardDescription className="mt-1">{student.student_id}</CardDescription>
                    </div>
                  </div>
                  <Badge className={getAlertBadgeClass(student.alert_level)} className="text-base px-3 py-1">
                    {student.alert_level} Risk
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  <div className="flex items-center gap-2">
                    <GraduationCap className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Department</p>
                      <p className="font-medium">{student.department}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Academic Year</p>
                      <p className="font-medium">{student.academic_year}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Gender</p>
                      <p className="font-medium">{student.gender}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <BookOpen className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">GPA</p>
                      <p className="font-medium text-lg">{parseFloat(student.gpa).toFixed(2)} / 4.0</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Activity className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Activity Score</p>
                      <p className="font-medium text-lg">{student.total_activity_score.toFixed(1)}%</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Trend</p>
                      <p className={`font-medium ${trendInfo.color}`}>
                        {trendInfo.icon} {student.improvement_trend}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Activity Score Progress */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Total Activity Score</CardTitle>
                <CardDescription>Composite engagement metric (0-100%)</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold">{student.total_activity_score.toFixed(1)}%</span>
                    <span className="text-sm text-muted-foreground">
                      {student.alert_level === 'Green'
                        ? 'Excellent Engagement'
                        : student.alert_level === 'Yellow'
                        ? 'Moderate Engagement'
                        : 'Low Engagement - Action Required'}
                    </span>
                  </div>
                  <div className="h-4 rounded-full bg-muted overflow-hidden">
                    <div
                      className={`h-full transition-all duration-500 ${
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
              </CardContent>
            </Card>

            {/* Engagement Metrics */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Engagement Metrics</CardTitle>
                <CardDescription>Week {student.week_number} performance</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Assignments Submitted</span>
                      <span className="font-medium">{student.assignments_submitted} / 5</span>
                    </div>
                    <div className="h-2 rounded-full bg-muted overflow-hidden">
                      <div
                        className="h-full bg-[hsl(var(--chart-1))]" 
                        style={{ width: `${(student.assignments_submitted / 5) * 100}%` }}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Attendance Rate</span>
                      <span className="font-medium">{student.attendance_rate}%</span>
                    </div>
                    <div className="h-2 rounded-full bg-muted overflow-hidden">
                      <div
                        className="h-full bg-[hsl(var(--chart-2))]" 
                        style={{ width: `${student.attendance_rate}%` }}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">LMS Logins</span>
                      <span className="font-medium">{student.lms_logins} / 20</span>
                    </div>
                    <div className="h-2 rounded-full bg-muted overflow-hidden">
                      <div
                        className="h-full bg-[hsl(var(--chart-3))]" 
                        style={{ width: `${(student.lms_logins / 20) * 100}%` }}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Library Visits</span>
                      <span className="font-medium">{student.library_visits} / 10</span>
                    </div>
                    <div className="h-2 rounded-full bg-muted overflow-hidden">
                      <div
                        className="h-full bg-[hsl(var(--chart-4))]" 
                        style={{ width: `${(student.library_visits / 10) * 100}%` }}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Events Attended</span>
                      <span className="font-medium">{student.events_attended} / 5</span>
                    </div>
                    <div className="h-2 rounded-full bg-muted overflow-hidden">
                      <div
                        className="h-full bg-[hsl(var(--chart-5))]" 
                        style={{ width: `${(student.events_attended / 5) * 100}%` }}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Office Hours Visits</span>
                      <span className="font-medium">{student.office_hours_visits} / 5</span>
                    </div>
                    <div className="h-2 rounded-full bg-muted overflow-hidden">
                      <div
                        className="h-full bg-[hsl(var(--primary))]" 
                        style={{ width: `${(student.office_hours_visits / 5) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Charts */}
            <StudentEngagementCharts student={student} />

            {/* Advisor Comments */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Advisor Comments</CardTitle>
                <CardDescription>Add notes and recommendations for this student</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Enter advisor comments, recommendations, or action items..."
                  rows={4}
                  className="resize-none"
                />
                <Button onClick={handleSaveComment} disabled={isSaving} className="gap-2">
                  <Save className="h-4 w-4" />
                  {isSaving ? 'Saving...' : 'Save Comment'}
                </Button>
              </CardContent>
            </Card>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default StudentProfileModal;