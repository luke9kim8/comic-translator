import React, {useRef, useEffect, useState} from 'react'

const ClickMode = {"GetColor": 1, "Draw": 2, "SetText": 3};


export default function Canvas(props) {
  const {width, height, imageToShow, textToShow} = props;
  const imgRef = useRef(null);
  const canvasRef = useRef(null);
  const [pos, setPos] = useState({x:0, y:0});
  const [clickMode, setClickMode] = useState(ClickMode.GetColor);
  const [color, setColor] = useState({r:0, g:0, b:0});

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const img = new Image();
    
    img.src=imageToShow;
    img.onload = () => {
      console.log(img)
      ctx.drawImage(img, 0,0);
      ctx.fillStyle = "black";
      ctx.fillText(textToShow, 10, 180);
    }
    const constDataURL = canvas.toDataURL();
    console.log(constDataURL);
  }, []);

  const canvasDrawHandler = (e) => {
    const newPos = {x: e.nativeEvent.clientX, y: e.nativeEvent.clientY}
    setPos(newPos);
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const rect = canvas.getBoundingClientRect();
    console.log(clickMode)
    if (clickMode === ClickMode.Draw) {
      const imgData = ctx.getImageData(newPos.x - rect.left, newPos.y - rect.top, 10,10);
      const pix = imgData.data;
      for (var i = 0, n = pix.length; i < n; i += 4) {
        pix[i  ] = 255 - pix[i  ]; // red
        pix[i+1] = 255 - pix[i+1]; // green
        pix[i+2] = 255 - pix[i+2]; // blue
        // i+3 is alpha (the fourth element)
      }
      ctx.putImageData(imgData, newPos.x - rect.left, newPos.y - rect.top,);
    } else if (clickMode === ClickMode.GetColor) {
      const imgData = ctx.getImageData(newPos.x - rect.left, newPos.y - rect.top, 1,1);
      console.log(imgData.data);
      setColor({r:imgData.data[0], g:imgData.data[1], b:imgData.data[2]});
    }
  }

  

  return (
    <div>
      {/* <div>
        <h3>Original Image</h3>
        <img ref={imgRef} src={imageToShow}/>
      </div> */}
      <button onClick={() => setClickMode(ClickMode.GetColor)}>Get Color</button>
      <button onClick={() => setClickMode(ClickMode.Draw)}>Draw</button>
      <div>
        <h3>Canvas Image </h3>
        
        <canvas onMous={canvasDrawHandler}ref={canvasRef} width={width} height={height}/>
      </div>
    </div>
  )
}
