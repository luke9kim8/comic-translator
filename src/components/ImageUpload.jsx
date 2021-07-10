import React, {useCallback, useState} from 'react';
// import Dropzone from './Dropzone';
import {storage,imageRef} from "../firebase";
import Canvas from './Canvas';

const baseStyle = {
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: '64px',
  borderWidth: 2,
  borderRadius: 2,
  borderColor: '#eeeeee',
  borderStyle: 'dashed',
  backgroundColor: '#fafafa',
  color: '#bdbdbd',
  outline: 'none',
  margin: "24px",
  transition: 'border .24s ease-in-out'
};

const activeStyle = {
  borderColor: '#2196f3'
};

const acceptStyle = {
  borderColor: '#00e676'
};

const rejectStyle = {
  borderColor: '#ff1744'
};


export default function ImageUpload() {
  const [uploading, setUploading] = useState(false);
  const [dropDisabled, setDropDisabled] = useState(false);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [image, setImage] = useState(null);
  const [dimensions, setDimensions] = useState({});
  const [tempImageUrl, setTempImageUrl] = useState("");

  const onDropCallback = useCallback(async (acceptedFile) => {
    setUploading(true);
    const file = acceptedFile[0];
    console.log("from drop")
    console.log(file)
    if (!file) {
      setError(true);
      setErrorMessage("Please submit an image file.")
    } else {
      
    }
    setUploading(false)
  }, [dropDisabled])

  const getHeightAndWidthFromDataUrl = dataURL => new Promise(resolve => {
    const img = new Image()
    img.onload = () => {
      resolve({
        height: img.height,
        width: img.width
      })
    }
    img.src = dataURL
  })

  const handleChange = async (e) => {
    if (e.target.files[0]) {
      const imageFile = e.target.files[0];
      // console.log
      setImage(imageFile);
      const imgURL = URL.createObjectURL(e.target.files[0]);
      setTempImageUrl(imgURL);
      const dimensions = await getHeightAndWidthFromDataUrl(imgURL);
      console.log(dimensions)
      setDimensions(dimensions);
    }
  }


  
  const handleUpload = async() => {

    await imageRef.child(image.name).put(image);
    const downloadURL = await imageRef.child(image.name).getDownloadURL();
    console.log(downloadURL)
  }

  return (
    <div>
      {/* <Dropzone onDrop={onDropCallback} 
          baseStyle={baseStyle} 
          activeStyle={acceptStyle}
          rejectStyle={rejectStyle}
          disabled={dropDisabled}/> */}
          <input type="file" onChange={handleChange}/>
          <button onClick={handleUpload}>Upload</button>
          {tempImageUrl 
            && <Canvas 
                imageToShow={tempImageUrl}
                textToShow="Blah blah"
                width={dimensions.width}
                height={dimensions.height}/>}
    </div>
  )
}
