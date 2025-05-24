import React from 'react';
import { Router } from './presentation/navigation/Router';
import './App.css';

// Componente principal de la aplicación que utiliza el Router de la capa de presentación
function App() {
  return (
    <div className="App">
      <Router />
    </div>
  );
}

export default App;
