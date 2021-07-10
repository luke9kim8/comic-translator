import logo from './logo.svg';
import './App.css';
import ImageUpload from './components/ImageUpload';
import React,{useState} from 'react';
import ViewComics from './pages/ViewComics';

function App() {
  const [option, setOption] = useState("Translate")
  console.log(option)
  return (
    <div className="App">
      <div className="Layout">
        <h1 >Comic Translator</h1>
          <div className="nav">
            <h3 className="navBtn" onClick={() => setOption("Translate")}>Translate Comic</h3>
            <h3 className="navBtn"  onClick={() => setOption("View")}>View Comic</h3>
          </div>
      </div>
      <main>
        {console.log(option === "Translate")}
        {     
          (option === "Translate") ?
            <ImageUpload/> :<ViewComics/>

        }
      </main>
    </div>
  );
}

export default App;
