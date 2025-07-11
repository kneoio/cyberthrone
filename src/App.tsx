import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline, Box } from '@mui/material';
import { ROUTES } from './utils/constants';
import ErrorBoundary from './components/common/ErrorBoundary';
import Header from './components/common/Header';
import Footer from './components/common/Footer';
import ProtectedRoute from './components/auth/ProtectedRoute';
import HomePage from './pages/HomePage';
import DictatorsPage from './pages/DictatorsPage';
import DictatorDetailPage from './pages/DictatorDetailPage';
import ProfilePage from './pages/ProfilePage';
import CreateProfilePage from './pages/CreateProfilePage';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
          <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <Header />
            
            <Box component="main" sx={{ flexGrow: 1, px: 3 }}>
              <Box sx={{ maxWidth: '1200px', margin: '0 auto' }}>
                <Routes>
                  {/* Public Routes */}
                  <Route path={ROUTES.HOME} element={<HomePage />} />
                  <Route path={ROUTES.DICTATORS} element={<DictatorsPage />} />
                  <Route path={ROUTES.DICTATOR_DETAIL} element={<DictatorDetailPage />} />
                  
                  {/* Protected Routes */}
                  <Route 
                    path={ROUTES.PROFILE} 
                    element={
                      <ProtectedRoute>
                        <ProfilePage />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path={ROUTES.CREATE_PROFILE} 
                    element={
                      <ProtectedRoute>
                        <CreateProfilePage />
                      </ProtectedRoute>
                    } 
                  />
                  
                  {/* 404 Route */}
                  <Route path="*" element={<div>Page not found</div>} />
                </Routes>
              </Box>
            </Box>
            
            <Footer />
          </Box>
        </Router>
      </ThemeProvider>
    </ErrorBoundary>
  );
};

export default App;
