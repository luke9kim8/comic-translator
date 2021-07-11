import React, {useRef, useEffect, useState, useCallback} from 'react'
import {storage,imageRef, db} from "../firebase";
import './site.css';
import {ImEyedropper} from "react-icons/im";
import {BiPencil} from "react-icons/bi";
import {VscTextSize} from "react-icons/vsc";


const ClickMode = {"GetColor": 1, "Draw": 2, "SetText": 3};

export default function Canvas(props) {
  const {width, height, imageToShow, textToShow, imgElement} = props;
  const imgRef = useRef(null);
  const canvasRef = useRef(null);
  const [mousePosition, setMousePosition] = useState({x:0, y:0});
  const [clickMode, setClickMode] = useState(ClickMode.GetColor);
  const [color, setColor] = useState({r:0, g:0, b:0});
  const [isPainting, setIsPainting] = useState(false);
  const [brushPixel, setBrushPixel] = useState(10);
  const [drawList, setDrawList] = useState([]);
  

  const drawLine = (originalMousePosition, newMousePosition) => {
    if (!canvasRef.current || clickMode !== ClickMode.Draw) {
        return;
    }
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    if (context) {
        context.strokeStyle = `rgb(${color.r},${color.g},${color.b})`;
        context.lineJoin = 'round';
        context.lineWidth = brushPixel;
        setDrawList(drawList);
        context.beginPath();
        context.moveTo(originalMousePosition.x, originalMousePosition.y);
        context.lineTo(newMousePosition.x, newMousePosition.y);
        context.closePath();
        context.stroke();
    }
  };

  const paint = useCallback(
    (event) => {
        if (isPainting) {
            const newMousePosition = getCoordinates(event);
            if (mousePosition && newMousePosition) {
                drawLine(mousePosition, newMousePosition);
                setMousePosition(newMousePosition);
            }
        }
    },
    [isPainting, mousePosition]
  );

  const exitPaint = useCallback(() => {
    setIsPainting(false);
  }, []);

  const getCoordinates = (event) => {
      if (!canvasRef.current) {
          return;
      }

      const canvas = canvasRef.current;
      return {x: event.pageX - canvas.offsetLeft, y: event.pageY - canvas.offsetTop};
  };

  const startPaint = useCallback((event) => {
      const coordinates = getCoordinates(event);
      if (coordinates) {
          setIsPainting(true);
          setMousePosition(coordinates);
      }
  }, []);

  

  useEffect(() => {
    if (imgElement) {
      console.log(imgElement);
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(imgElement, 0,0, width, height);
    }
  }, [imgElement]);

  useEffect(() => {
      if (!canvasRef.current ) {
          return;
      }
      const canvas = canvasRef.current;
      canvas.addEventListener('mousedown', startPaint);
      return () => {
          canvas.removeEventListener('mousedown', startPaint);
      };
  }, [startPaint]);

  useEffect(() => {
    if (!canvasRef.current) {
        return;
    }
    const canvas = canvasRef.current;
    canvas.addEventListener('mousemove', paint);
    return () => {
        canvas.removeEventListener('mousemove', paint);
    };
  }, [paint]);

  useEffect(() => {
    if (!canvasRef.current) {
        return;
    }
    const canvas = canvasRef.current;
    canvas.addEventListener('mouseup', exitPaint);
    canvas.addEventListener('mouseleave', exitPaint);
    return () => {
        canvas.removeEventListener('mouseup', exitPaint);
        canvas.removeEventListener('mouseleave', exitPaint);
    };
  }, [exitPaint]);

  

  const canvasDrawHandler = (e) => {

    const newPos = {x: e.nativeEvent.clientX, y: e.nativeEvent.clientY}
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const rect = canvas.getBoundingClientRect();
    console.log(clickMode)

    const imgData = ctx.getImageData(newPos.x - rect.left, newPos.y - rect.top, 1,1);
    console.log(imgData.data);
    setColor({r:imgData.data[0], g:imgData.data[1], b:imgData.data[2]});
    if (clickMode === ClickMode.GetColor) {
      const imgData = ctx.getImageData(newPos.x - rect.left, newPos.y - rect.top, 1,1);
      console.log(imgData.data);
      setColor({r:imgData.data[0], g:imgData.data[1], b:imgData.data[2]});
    } 
    else if (clickMode === ClickMode.SetText) {

      const imgData = ctx.getImageData(newPos.x - rect.left, newPos.y - rect.top, 1,1);
      var input = document.getElementById("userInput").value;
      var fontInput = document.getElementById("fontInput").value;
      var fontSizeInput = document.getElementById("fontSizeInput").value;
      ctx.font = fontSizeInput + '' + fontInput;
      ctx.fillText(input, newPos.x - rect.left, newPos.y - rect.top);

      
    }
  }

  const uploadHandler = async () => {
    const blob = await new Promise(resolve => canvasRef.current.toBlob(resolve));
    console.log(blob)
    await imageRef.child(imgElement.name).put(blob);
    db.collection("edited-comics").add({
      name: imgElement.name
    })
    .then(docRef => console.log("Document written with id ", docRef.id))
    .catch(err => console.log(err));
  }

  

  function iconControl(){
    if (clickMode===1){
      return <ImEyedropper size={50} />
    }
    if (clickMode===2){
      return <BiPencil size={50} />
    }
    if (clickMode===3){
      return <VscTextSize size={50} />
    }
  }
  return (
    <div>
      <div class="optionsBanner">
        <div class="buttons">
          <button id="getColorBtn" onClick={() => setClickMode(ClickMode.GetColor)}>Get Color</button>
          <button id="drawBtn" onClick={() => setClickMode(ClickMode.Draw)}>Draw</button>
        </div><br/>
        {
          iconControl()
        }
        <br/>

        <div class="settings">
          <select class="brushSize" value="Brush Size" onChange={(e) => setBrushPixel(e.target.value)}>
            <option value={10}>10px</option>
            <option value={20}>20px</option>
            <option value={30}>30px</option>
            <option value={40}>40px</option>
            <option value={50}>50px</option>
          </select>
          <button id="uploadChanged" onClick={uploadHandler}>Upload changed</button>
          
          <button id="setTextBtn" onClick={() => setClickMode(ClickMode.SetText)}>Set Text</button>
        </div>
        
        <div class="textSettings">
          <input type="text" id="userInput"></input>

          <select name="fonts" id="fontInput">
            <option value="Arial">Arial</option>
            <option value="Georgia">Georgia</option>
            <option value="Papyrus">Papyrus</option>
          </select>

          <select name="fontSize" id="fontSizeInput">
            <option value="10px ">10px</option>
            <option value="20px ">20px</option>
            <option value="30px ">30px</option>
            <option value="40px ">40px</option>
            <option value="50px ">50px</option>
          </select>

        </div>

        <div class="Credentials">
          <label for="comicName">Title: </label>
          <input id="comicTitle"></input>
          <br/>
          <label for="creatorName">Creator: </label>
          <input id="ogAuth"></input>
          <br/>
          <label for="translatorName">Translator: </label>
          <input id="translator"></input>
        </div>
      </div>

      
      <div class="canvasImage">
        <h3>Canvas Image </h3>
        <canvas onClick={canvasDrawHandler} ref={canvasRef} width={width} height={height}/>
      </div>
    </div>
  )
}
