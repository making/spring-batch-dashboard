import { Routes, Route } from 'react-router-dom'
import { MainLayout } from './layouts/MainLayout'
import { SearchStateProvider } from './context/SearchStateContext'
import ErrorBoundary from './components/ErrorBoundary'

// Import pages
import Dashboard from './pages/Dashboard'
import JobInstancesList from './pages/JobInstancesList'
import JobInstanceDetail from './pages/JobInstanceDetail'
import JobExecutionsList from './pages/JobExecutionsList'
import JobExecutionDetail from './pages/JobExecutionDetail'
import StepExecutionDetail from './pages/StepExecutionDetail'
import Statistics from './pages/Statistics'
import NotFound from './pages/NotFound'

function App() {
  return (
    <ErrorBoundary>
      <SearchStateProvider>
        <Routes>
          <Route path="/" element={<MainLayout><Dashboard /></MainLayout>} />
          
          {/* Job Instances */}
          <Route path="/job-instances" element={<MainLayout><JobInstancesList /></MainLayout>} />
          <Route path="/job-instances/:jobInstanceId" element={<MainLayout><JobInstanceDetail /></MainLayout>} />
          
          {/* Job Executions */}
          <Route path="/job-executions" element={<MainLayout><JobExecutionsList /></MainLayout>} />
          <Route path="/job-executions/:jobExecutionId" element={<MainLayout><JobExecutionDetail /></MainLayout>} />
          
          {/* Step Executions */}
          <Route path="/step-executions/:stepExecutionId" element={<MainLayout><StepExecutionDetail /></MainLayout>} />
          
          {/* Statistics */}
          <Route path="/statistics" element={<MainLayout><Statistics /></MainLayout>} />
          <Route path="/statistics/:jobName" element={<MainLayout><Statistics /></MainLayout>} />
          
          {/* 404 Not Found */}
          <Route path="*" element={<MainLayout><NotFound /></MainLayout>} />
        </Routes>
      </SearchStateProvider>
    </ErrorBoundary>
  )
}

export default App
