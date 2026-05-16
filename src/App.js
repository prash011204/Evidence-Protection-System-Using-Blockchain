import './App.css';
import Navbar from './Components/Navbar';
import Footer from './Components/Footer';
import Contact from './Components/Contact';
import Info from './Components/Info';
import Upload from './Components/Upload';
import View from './Components/View';
import {BrowserRouter as Router,Routes,Route} from "react-router-dom";
import Login from './Components/Login';
import ProtectedRoute from './Components/routes/ProtectedRoute';
import NormalRoute from './Components/routes/NormalRoute';
import ManageUser from './Components/Admin/ManageUser';
import AdminRoute from './Components/routes/AdminRoute';
import Logs from './Components/Admin/Logs';
import Delete from './Components/Delete';
import Overview from "./Components/Admin/Overview";

function App() {
  return (
    <Router>
      <div className="app-wrapper">
        <Navbar />

        <div className="main-content">
          <Routes>
            <Route path='/' element={<Info />} />

            <Route path='/Contact' element={
              <ProtectedRoute>
                <Contact />
              </ProtectedRoute>
            } />

            <Route path='/Upload' element={
              <ProtectedRoute>
                <Upload />
              </ProtectedRoute>
            } />

            <Route path='/View' element={
              <ProtectedRoute>
                <View />
              </ProtectedRoute>
            } />

            <Route path='/Delete' element={
              <ProtectedRoute>
                <Delete />
              </ProtectedRoute>
            } />

            <Route path='/Login' element={
              <NormalRoute>
                <Login />
              </NormalRoute>
            } />

            <Route path='/ManageUser' element={
              <AdminRoute>
                <ManageUser />
              </AdminRoute>
            } />

            <Route path='/Logs' element={
              <AdminRoute>
                <Logs />
              </AdminRoute>
            } />

            {/* ✅ ADD THIS */}
            <Route path='/Overview' element={
              <AdminRoute>
                <Overview />
              </AdminRoute>
            } />

          </Routes>
        </div>

        {/* <Footer /> */}
      </div>
    </Router>
  );
}

export default App;