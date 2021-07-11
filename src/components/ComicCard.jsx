import React, {useState, useRef} from 'react'
import './ComicCard.css'

export default function ComicCard(props) {
  const [showComic, setShowComic] = useState(false);
  const {downloadURL, name, comicTitle, translatorName, creatorName, source} = props.comic;
  
  return (
    <div className="comic-div">
      <div className="comic-card" onClick={() => setShowComic(!showComic)}>
        <img width="100" height="100" src={downloadURL}/>
        <div className="comic-text" >
          <h4>{"Title: "+comicTitle}</h4>
          <p>{"Credit: " + creatorName}</p>
          <p>{"Translator: " + translatorName}</p>
          <a href={source}>Link to Original</a>
        </div>
      </div>
      {
        showComic && 
        <img src={downloadURL}/>
      }
    </div>
  )
}
