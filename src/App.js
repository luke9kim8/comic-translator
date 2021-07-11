import logo from './logo.svg';
import './App.css';
import ImageUpload from './components/ImageUpload';
import React,{useState} from 'react';
import ViewComics from './pages/ViewComics';
import Landing from './pages/landing';

function App() {
  const [option, setOption] = useState("Landing")
  console.log(option)
  return (
    <div className="App">
      <div className="Layout">
        <h1 onClick={() => setOption("Landing")}>Comic Translator</h1>
          <div className="nav">
            <h3 className="navBtn" onClick={() => setOption("Translate")}>Translate</h3>
            <h3 className="navBtn"  onClick={() => setOption("View")}>View Comics</h3>
          </div>
      </div>
      <main>
        {console.log(option === "Translate")}
        {     
          (option === "Translate") &&
            <ImageUpload/> 
        }
        {     
          (option === "View") &&
            <ViewComics/> 
        }
        {     
          (option === "Landing") &&
            <Landing/> 
        }
      </main>
      <footer>
        <div style={{fontSize:"smaller"}}>
        <a href='https://www.freepik.com/vectors/background'>Background vector created by starline - www.freepik.com</a>
        <a href='https://www.freepik.com/vectors/background'>Background vector created by rawpixel.com - www.freepik.com</a>
        </div>
      </footer>
    </div>
  );
}

export default App;
