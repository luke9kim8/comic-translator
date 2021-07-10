import React, {useMemo} from 'react'
import {useDropzone} from 'react-dropzone'


export default function StyledDropzone({
  onDrop, 
  baseStyle, 
  activeStyle, 
  acceptStyle, 
  rejectStyle,
  disabled
}) {
  const {
    getRootProps,
    getInputProps,
    isDragActive,
    isDragAccept,
    isDragReject
  } = useDropzone({
    accept: 'image/*',
    onDrop: onDrop
  });

  const style = useMemo(() => ({
    ...baseStyle,
    ...(isDragActive ? activeStyle : {}),
    ...(isDragAccept ? acceptStyle : {}),
    ...(isDragReject ? rejectStyle : {})
  }), [
    isDragActive,
    isDragReject,
    isDragAccept
  ]);

  return (
    <div className="container">
      <div {...getRootProps({style})}>
        <input {...getInputProps({disabled})} />
        <p>Drag 'n' drop some files here, or click to select files</p>
      </div>
    </div>
  );
}
