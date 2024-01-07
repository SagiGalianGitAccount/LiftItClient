import './App.css';
import Home from './pages/home';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Register from './pages/register';
import Login from './pages/login';
import 'bootstrap/dist/css/bootstrap.css';
import { useEffect } from 'react';

function App() {

  useEffect(() => {
   
    window.addEventListener('beforeunload', function(e){
      if (localStorage.getItem('rememberMe') == "false") localStorage.clear();
    })
    return window.removeEventListener('beforeunload', BeforeUnloadEvent);
  }, [])

  return (
    <div className="App">
        <BrowserRouter>
            <Routes>
                <Route path='/home' element={<Home />} />
                <Route path='/register' element={<Register />} />
                <Route path='/login' element={<Login />} />
                <Route path='/' element={<Home />} />
            </Routes>    
        </BrowserRouter> 
    </div>
  );
}

export default App;
