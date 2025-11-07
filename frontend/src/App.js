import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from '@/components/ui/sonner';
import Dashboard from '@/pages/Dashboard';
import Students from '@/pages/Students';
import Alerts from '@/pages/Alerts';
import DataSummary from '@/pages/DataSummary';
import Layout from '@/components/Layout';
import '@/App.css';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/students" element={<Students />} />
            <Route path="/alerts" element={<Alerts />} />
            <Route path="/data-summary" element={<DataSummary />} />
          </Routes>
        </Layout>
      </BrowserRouter>
      <Toaster position="top-right" />
    </div>
  );
}

export default App;