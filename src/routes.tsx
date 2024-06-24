import { BrowserRouter, Outlet, Route, Routes } from 'react-router-dom';

import Allocation from './pages/Allocation';
import Course from './pages/Course';
import Department from './pages/Department';
import Home from './pages/Home';
import Layout from './components/Layout';
import Professor from './pages/Professor';
import ProfessorForm from './pages/Professor/ProfessorForm';
import DepartmentForm from "./pages/Department/DepartmentForm"
import Page from './components/Page';

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          element={
            <Layout>
              <Outlet />
            </Layout>
          }
        >
          <Route path='/' element={<Home />} />

          <Route path='/allocation' element={<Allocation />} />
          <Route path='/course' element={<Course />} />
          {/* <Route path='/department' element={<Department />} /> */}

          <Route path='/professor'>
            <Route index element={<Professor />} />
            <Route path='create' element={<ProfessorForm />} />
            <Route path=':id/update' element={<ProfessorForm />} />
          </Route>
          <Route path='/department'>
            <Route index element={<Department />} />
            <Route path='create' element={<DepartmentForm />} />
            <Route path=':id/update' element={<DepartmentForm />} />
          </Route>

          <Route
            path='*'
            element={<Page title='404...'>Page not found</Page>}
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;
