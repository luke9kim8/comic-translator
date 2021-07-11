import React from 'react'
import './landing.css'
export default function Landing() {
  return (
    <div >
      <img className="landing-background"width="100%"src="85238.jpg"/>
      <div className="landing-card">
        <img width="500px" src="11427.jpg"/>
        <div className="landing-text">
          <h1>Translate and view cartoons</h1>
          <p>Editing cartoons and adding translations has never been easier. Upload it, credit the OG author, and share it with everyone!</p>
        </div>
          
      </div>
      <div style={{fontSize:"smaller"}}>
        <a href='https://www.freepik.com/vectors/background'>Background vector created by starline - www.freepik.com</a>
        <a href='https://www.freepik.com/vectors/background'>Background vector created by rawpixel.com - www.freepik.com</a>
        </div>
    </div>
  )
}
