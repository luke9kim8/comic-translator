import React, {useState, useRef} from 'react'
import './ComicCard.css'

export default function ComicCard(props) {
  const [showComic, setShowComic] = useState(false);
  const {downloadURL, name} = props.comic;
  
  return (
    <div className="comic-div">
      <div className="comic-card" onClick={() => setShowComic(!showComic)}>
        <img width="100" height="100" src={downloadURL}/>
        <h4>{name}</h4>
      </div>
      {
        showComic && 
        <img src={downloadURL}/>
      }
    </div>
  )
}
