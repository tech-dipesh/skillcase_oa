import { Outlet, Navigate } from 'react-router';
import { useSelector } from 'react-redux';

import "./App.css"
function App() {
  const { token } = useSelector((state) => state.auth);
  return <Outlet />;
}

export default App;
