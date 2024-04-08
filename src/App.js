import './App.css';
import {AuthContext} from './Context/AuthContext';
import { useContext } from 'react';
import { Auth } from './Context/AuthContext';
import NavigationRoutes from './Routes/NavigationRoutes';

function App() {
  
  return (
    <div className="App">
      <Auth>
        <NavigationRoutes/>
      </Auth>
    </div>
  );
}

export default App;