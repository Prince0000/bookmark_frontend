import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Main from "./components/Main";
import Signup from "./components/Singup";
import Login from "./components/Login";
import BookmarkList from './components/Main/BookmarkList';
import AllDashboardRoutes from './components/Main/AllDashboardRoutes';
import AddCollections from './components/Main/AddCollection';

function App() {
  const user = localStorage.getItem("token");
  
  return (
    <Router>
      <Routes>
        <Route path="/" element={user ? <Navigate to="/dashboard" /> : <Navigate to="/login" />} />
        <Route path="/signup" element={!user ? <Signup /> : <Navigate to="/dashboard" />} />
        <Route path="/login" element={!user ? <Login /> : <Navigate to="/dashboard" />} />
        {user ? (
          <Route path='/dashboard' element={<Main />} >
            <Route index element={<BookmarkList />} />
            <Route  path=':id' element={<AllDashboardRoutes/>}/>
            <Route  path='add-collection' element={<AddCollections/>}/>
            <Route path=':collections/:id' element={<AllDashboardRoutes />} />
          </Route>
        ) : (
          <Route path='/dashboard' element={<Navigate to="/login"/>} />
        )}
      </Routes>
    </Router>
  );
}

export default App;
