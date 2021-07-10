import React, {useRef, useEffect, useState, useCallback} from 'react'
import {storage,imageRef} from "../firebase";

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
  }

  const uploadHandler = async () => {
    const blob = await new Promise(resolve => canvasRef.current.toBlob(resolve));
    console.log(blob)
    await imageRef.child("name1").put(blob);
  }

  

  return (
    <div>
      <button onClick={() => setClickMode(ClickMode.GetColor)}>Get Color</button>
      <button onClick={() => setClickMode(ClickMode.Draw)}>Draw</button>
      <h1>{clickMode}</h1>
      <select value="Brush Size" onChange={(e) => setBrushPixel(e.target.value)}>
        <option value={10}>10px</option>
        <option value={20}>20px</option>
        <option value={30}>30px</option>
        <option value={40}>40px</option>
        <option value={50}>50px</option>
      </select>
      <button onClick={uploadHandler}>Upload changed</button>
      {/* <button onClick={undoHandler}>Undo List</button> */}
      <div>
        <h3>Canvas Image </h3>
        <canvas onClick={canvasDrawHandler}ref={canvasRef} width={width} height={height}/>
      </div>
    </div>
  )
}
