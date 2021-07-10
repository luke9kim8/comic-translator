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

  let history = [
    {
      x: 20,
      y: 20
    }
  ];
  let historyStep = 0;


  const canvasDrawHandler = (e) => {

    handleUndo = () => {
      if (historyStep === 0) {
        return;
      }
      historyStep -= 1;
      const previous = history[historyStep];
      this.setState({
        position: previous
      });
    };

    handleRedo = () => {
      if (historyStep === history.length - 1) {
        return;
      }
      historyStep += 1;
      const next = history[historyStep];
      this.setState({
        position: next
      });
    };

    const newPos = {x: e.nativeEvent.clientX, y: e.nativeEvent.clientY}
    setPos(newPos);
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const rect = canvas.getBoundingClientRect();
    console.log(clickMode)
    if (clickMode === ClickMode.Draw) {
      const imgData = ctx.getImageData(newPos.x - rect.left, newPos.y - rect.top, 50,50);
      const pix = imgData.data;
      for (var i = 0, n = pix.length; i < n; i += 4) {
        pix[i  ] = color.r; // red
        pix[i+1] = color.g; // green
        pix[i+2] = color.b; // blue
        // i+3 is alpha (the fourth element)
      }
      ctx.putImageData(imgData, newPos.x - rect.left, newPos.y - rect.top,);

      history = history.slice(0, historyStep + 1);
      history = history.concat([imgData]);
      historyStep += 1;

    } else if (clickMode === ClickMode.GetColor) {
      const imgData = ctx.getImageData(newPos.x - rect.left, newPos.y - rect.top, 1,1);
      console.log(imgData.data);
      setColor({r:imgData.data[0], g:imgData.data[1], b:imgData.data[2]});
    } 
    else if (clickMode === ClickMode.SetText) {



      const imgData = ctx.getImageData(newPos.x - rect.left, newPos.y - rect.top, 1,1);
      var input = document.getElementById("userInput").value;
      ctx.font = "30px Arial";
      ctx.fillText(input, newPos.x - rect.left, newPos.y - rect.top);

      
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
      <button onClick={() => setClickMode(ClickMode.SetText)}>Set Text</button>

      <button text="undo" onClick={this.handleUndo} />
      <button text="redo" x={40} onClick={this.handleRedo} />
      
      <div>
        <h3>Canvas Image </h3>
        
        <canvas onClick={canvasDrawHandler}ref={canvasRef} width={width} height={height}/>
        <input type="text" id="userInput"></input>;
      </div>
    </div>
  )
}
