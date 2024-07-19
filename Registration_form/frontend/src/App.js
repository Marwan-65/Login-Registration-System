
import './App.css';
import Login from './login'
import Register from './Register'
import Home from './home'
import {BrowserRouter, Routes, Route} from 'react-router-dom'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/register' element={<Register/>}></Route>
        <Route path='/' element={<Login/>}></Route>
        <Route path='/home' element={<Home/>}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
