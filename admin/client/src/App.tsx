import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AdminLayout from '@/components/layout/AdminLayout';
import LoginPage from '@/components/auth/LoginPage';
import Dashboard from '@/components/dashboard/Dashboard';
import UserList from '@/components/users/UserList';
import UserForm from '@/components/users/UserForm';
import ContentList from '@/components/content/ContentList';
import ContentForm from '@/components/content/ContentForm';
import ProtectedRoute from '@/components/auth/ProtectedRoute';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/admin/login" element={<LoginPage />} />
        <Route path="/admin" element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }>
          <Route index element={<Dashboard />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="users" element={<UserList />} />
          <Route path="users/add" element={<UserForm />} />
          <Route path="users/edit/:id" element={<UserForm />} />
          <Route path="content" element={<ContentList />} />
          <Route path="content/add" element={<ContentForm />} />
          <Route path="content/edit/:id" element={<ContentForm />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App