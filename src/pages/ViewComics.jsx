import React, {useEffect, useState} from 'react'
import ComicCard from '../components/ComicCard';
import { db, storage, imageRef } from '../firebase';
import './ViewComic.css';
export default function ViewComics() {
  const [comics, setComics] = useState([]);
  useEffect(async () => {
    
    const snapshot = await db.collection('edited-comics').get();
    const newComics = await Promise.all(snapshot.docs.map(async (doc) => {
      const downloadURL = await imageRef.child(doc.data().comicTitle).getDownloadURL();
      return {
        downloadURL,
        ...doc.data()
      }
    }))
    setComics(newComics);

    return () => {
      
    }
  }, [])

  return (
    <div >
    <h3>View Comics</h3>
      <div className="view-comic">
      {
        comics.map(comic => {
          return (
            <ComicCard comic={comic}/>
          )
        })
      }
      </div>
    </div>
  )
}
