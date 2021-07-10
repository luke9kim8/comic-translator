import logo from './logo.svg';
import './App.css';
import ImageUpload from './components/ImageUpload';

function App() {
  console.log(process.env)
  return (
    <div className="App">
      <ImageUpload/>
    </div>
  );
}

export default App;
