import * as XLSX from 'xlsx';

let cachedData = null;

// Calculate total activity score based on engagement metrics
export const calculateActivityScore = (row) => {
  const assignments = parseFloat(row.assignments_submitted) || 0;
  const attendance = parseFloat(row.attendance_rate) || 0;
  const logins = parseFloat(row.lms_logins) || 0;
  const library = parseFloat(row.library_visits) || 0;
  const events = parseFloat(row.events_attended) || 0;
  const officeHours = parseFloat(row.office_hours_visits) || 0;
  const discussions = parseFloat(row.discussion_posts) || 0;

  const score = (
    (0.2 * (assignments / 5)) +
    (0.2 * (attendance / 100)) +
    (0.15 * (logins / 20)) +
    (0.15 * (library / 10)) +
    (0.1 * (events / 5)) +
    (0.1 * (officeHours / 5)) +
    (0.1 * (discussions / 10))
  ) * 100;

  return Math.min(100, Math.max(0, score));
};

// Determine alert level based on activity score
export const getAlertLevel = (score) => {
  if (score >= 70) return 'Green';
  if (score >= 40) return 'Yellow';
  return 'Red';
};

// Load and process Excel data
export const loadExcelData = async (fileUrl) => {
  if (cachedData) return cachedData;

  try {
    const response = await fetch(fileUrl, {
      mode: 'cors',
      headers: {
        'Accept': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      }
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch Excel file: ${response.status}`);
    }
    
    const arrayBuffer = await response.arrayBuffer();
    const workbook = XLSX.read(arrayBuffer, { type: 'array' });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const jsonData = XLSX.utils.sheet_to_json(worksheet);

    console.log(`Loaded ${jsonData.length} records from Excel file`);

    // Process and enhance data - use ALL records from the file
    const processedData = jsonData.map((row, index) => {
      // Use the activity score from Excel if available, otherwise calculate
      let activityScore;
      if (row.total_activity_score !== undefined && row.total_activity_score !== null && row.total_activity_score !== '') {
        activityScore = parseFloat(row.total_activity_score);
      } else {
        activityScore = calculateActivityScore(row);
      }
      
      // Use the alert level from Excel if available, otherwise calculate based on score
      let alertLevel;
      if (row.alert_level && (row.alert_level === 'Green' || row.alert_level === 'Yellow' || row.alert_level === 'Red')) {
        alertLevel = row.alert_level;
      } else {
        alertLevel = getAlertLevel(activityScore);
      }
      
      return {
        ...row,
        id: row.student_id || index + 1,
        student_id: row.student_id || `STU${String(index + 1).padStart(4, '0')}`,
        student_name: row.student_name || `Student ${index + 1}`,
        department: row.department || 'General',
        gender: row.gender || 'Unknown',
        age: parseInt(row.age) || 20,
        academic_year: row.academic_year || '2024',
        gpa: parseFloat(row.gpa) || 0,
        scholarship_status: row.scholarship_status || 'No',
        course_id: row.course_id || 'COURSE001',
        credit_hours: parseInt(row.credit_hours) || 3,
        week_number: parseInt(row.week_number) || 1,
        lms_logins: parseFloat(row.lms_logins) || 0,
        assignments_submitted: parseFloat(row.assignments_submitted) || 0,
        attendance_rate: parseFloat(row.attendance_rate) || 0,
        events_attended: parseFloat(row.events_attended) || 0,
        office_hours_visits: parseFloat(row.office_hours_visits) || 0,
        discussion_posts: parseFloat(row.discussion_posts) || 0,
        library_visits: parseFloat(row.library_visits) || 0,
        total_activity_score: activityScore,
        alert_level: alertLevel,
        improvement_trend: row.improvement_trend || 'Stable',
        advisor_comments: row.advisor_comments || '',
        term: row.term || 'Fall 2024',
        data_generated: row.data_generated || new Date().toISOString(),
      };
    });

    cachedData = processedData;
    console.log(`Successfully processed ${processedData.length} student records`);
    return processedData;
  } catch (error) {
    console.error('Error loading Excel data:', error);
    console.error('Falling back to mock data generation');
    // Return mock data only as fallback
    return generateMockData();
  }
};

// Generate mock data for testing
const generateMockData = () => {
  const departments = ['Computer Science', 'Engineering', 'Business', 'Arts', 'Science'];
  const genders = ['Male', 'Female', 'Non-binary'];
  const trends = ['Improving', 'Declining', 'Stable'];
  const terms = ['Fall 2024', 'Spring 2024'];
  
  const mockData = [];
  
  for (let i = 0; i < 100; i++) {
    const assignments = Math.floor(Math.random() * 5);
    const attendance = Math.floor(Math.random() * 100);
    const logins = Math.floor(Math.random() * 20);
    const library = Math.floor(Math.random() * 10);
    const events = Math.floor(Math.random() * 5);
    const officeHours = Math.floor(Math.random() * 5);
    const discussions = Math.floor(Math.random() * 10);
    
    const row = {
      student_id: `STU${String(i + 1).padStart(4, '0')}`,
      student_name: `Student ${i + 1}`,
      department: departments[Math.floor(Math.random() * departments.length)],
      gender: genders[Math.floor(Math.random() * genders.length)],
      age: 18 + Math.floor(Math.random() * 8),
      academic_year: `${2020 + Math.floor(Math.random() * 4)}`,
      gpa: (2.0 + Math.random() * 2).toFixed(2),
      scholarship_status: Math.random() > 0.5 ? 'Yes' : 'No',
      course_id: `COURSE${String(Math.floor(Math.random() * 10) + 1).padStart(3, '0')}`,
      credit_hours: [3, 4, 5][Math.floor(Math.random() * 3)],
      week_number: Math.floor(Math.random() * 16) + 1,
      lms_logins: logins,
      assignments_submitted: assignments,
      attendance_rate: attendance,
      events_attended: events,
      office_hours_visits: officeHours,
      discussion_posts: discussions,
      library_visits: library,
      improvement_trend: trends[Math.floor(Math.random() * trends.length)],
      term: terms[Math.floor(Math.random() * terms.length)],
      advisor_comments: '',
      data_generated: new Date().toISOString(),
    };
    
    const activityScore = calculateActivityScore(row);
    row.total_activity_score = activityScore;
    row.alert_level = getAlertLevel(activityScore);
    row.id = row.student_id;
    
    mockData.push(row);
  }
  
  return mockData;
};

// Clear cache (useful for refresh functionality)
export const clearDataCache = () => {
  cachedData = null;
};

// Get advisor comments from localStorage
export const getAdvisorComment = (studentId) => {
  const comments = JSON.parse(localStorage.getItem('advisorComments') || '{}');
  return comments[studentId] || '';
};

// Save advisor comment to localStorage
export const saveAdvisorComment = (studentId, comment) => {
  const comments = JSON.parse(localStorage.getItem('advisorComments') || '{}');
  comments[studentId] = comment;
  localStorage.setItem('advisorComments', JSON.stringify(comments));
};

// Export all advisor comments as CSV
export const exportAdvisorComments = (studentsData) => {
  const comments = JSON.parse(localStorage.getItem('advisorComments') || '{}');
  const csvData = [];
  
  csvData.push(['Student ID', 'Student Name', 'Department', 'Comment', 'Date']);
  
  Object.entries(comments).forEach(([studentId, comment]) => {
    const student = studentsData.find(s => s.student_id === studentId);
    if (student) {
      csvData.push([
        studentId,
        student.student_name,
        student.department,
        comment,
        new Date().toLocaleDateString()
      ]);
    }
  });
  
  const csvContent = csvData.map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `advisor_comments_${new Date().toISOString().split('T')[0]}.csv`;
  link.click();
  URL.revokeObjectURL(url);
};

// Export data as CSV
export const exportToCSV = (data, filename = 'export.csv') => {
  if (!data || data.length === 0) return;
  
  const headers = Object.keys(data[0]);
  const csvData = [headers];
  
  data.forEach(row => {
    csvData.push(headers.map(header => row[header]));
  });
  
  const csvContent = csvData.map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
};