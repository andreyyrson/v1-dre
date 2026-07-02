import { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ChakraProvider } from '@chakra-ui/react';
import theme from './theme';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';

function App() {
  const [isAuth, setIsAuth] = useState(!!localStorage.getItem('token'));

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage onLogin={() => setIsAuth(true)} />} />
        <Route
          path="/*"
          element={
            <ChakraProvider theme={theme}>
              <Routes>
                <Route path="/dashboard" element={isAuth ? <DashboardPage /> : <Navigate to="/login" />} />
                <Route path="/" element={<Navigate to={isAuth ? "/dashboard" : "/login"} />} />
              </Routes>
            </ChakraProvider>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
