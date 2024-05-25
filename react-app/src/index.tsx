import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter, Navigate, Route, RouteProps, Routes, useLocation } from 'react-router-dom';
import LoginPage from './pages/auth/login';
import { AuthProvider, useAuth } from './providers/authProvider'; 
import UserProfilePage from './pages/userProfile/userProfile';

// Create router to route pages
// const router = createBrowserRouter([
//   { path: '/login', element: <LoginPage /> },
//   {
//     path: '/',
//     element: <App />, // Wrap App with ProtectedRoute
//     // children: [
//     //   { path: '/', element: <App /> },
//     // ],
//     errorElement: <div>404 Not Found</div>,
//   },
// ]);
export type RouteConfig = RouteProps & {
  /**
   * Required route path.   * E.g. /home   */
  path: string;
  /**
   * Specify a private route if the route
   should only be accessible for authenticated users   */
  isPrivate?: boolean;
};
export const router: RouteConfig[] = [
  { path: '/login', element: <LoginPage /> },
  {
    path: '/',
    element: <App />,
    isPrivate: true,
    errorElement: <div>404 Not Found</div>,
  },
  {
    path: '/user',
    element: <UserProfilePage />,
  }
];
export interface AuthRequiredProps {
  to?: string;
  children?: React.ReactNode;
}

export const AuthRequired: React.FC<AuthRequiredProps> = ({
  children,
  to = "/login",
}) => {
  const { user } = useAuth();
  const { pathname } = useLocation();

  if (!user && pathname !== to) {
    return <Navigate to={to} replace />;
  }
  return <>{children}</>;
};

const renderRouteMap = (route: RouteConfig) => {
  const { isPrivate, element, ...rest } = route;
  console.log("isPrivate", isPrivate);
  const authRequiredElement = isPrivate ? (
    <AuthRequired>{element}</AuthRequired>
  ) : (
    element
  );
  return <Route key={route.path} element={authRequiredElement} {...rest} />;
};
export const AppRoutes = () => {
  return <Routes>{router.map(renderRouteMap)}</Routes>;
};

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
