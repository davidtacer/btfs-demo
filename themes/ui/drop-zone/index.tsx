import React, { useEffect, useMemo, useState } from 'react'
import { DropzoneInputProps, useDropzone } from 'react-dropzone'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faXmark } from '@fortawesome/free-solid-svg-icons'
import * as _ from 'lodash'

interface IDropzoneProps extends DropzoneInputProps {
  uploadedFiles?: any[]
  onDropFiles?: any
  onChangeFiles?: any
  hideUpload?: boolean
}

const Dropzone: React.FC<IDropzoneProps> = ({ multiple, uploadedFiles, onDropFiles, onChangeFiles, hideUpload = false }) => {
  const [files, setFiles] = useState([])
  const { getRootProps, getInputProps, isFocused, isDragAccept, isDragReject, isDragActive } = useDropzone({
    accept: {
      'image/*': [],
      'video/*': [],
    },
    onDrop: acceptedFiles => {
      setFiles(
        acceptedFiles.map((file, index: number) =>
          Object.assign(file, {
            isDefault: index === 0,
            preview: URL.createObjectURL(file)
          })
        )
      )
      onDropFiles(acceptedFiles)
    },
    multiple: !!multiple
  })

  const handleOnRemove = index => {
    files.splice(index, 1)

    setFiles(_.cloneDeep(files))
    onChangeFiles(_.cloneDeep(files))
  }

  const handleOnClick = index => {
    const updatedFiles = files.map((file, i) =>
      Object.assign(file, {
        isDefault: i === index
      })
    )

    setFiles(_.cloneDeep(updatedFiles))
    onChangeFiles(_.cloneDeep(updatedFiles))
  }

  const style: any = useMemo(
    () => ({
      ...baseStyle,
      ...(isFocused ? focusedStyle : {}),
      ...(isDragAccept ? acceptStyle : {}),
      ...(isDragReject ? rejectStyle : {})
    }),
    [isFocused, isDragAccept, isDragReject]
  )

  const thumbs = files.map((file, index: number) => (
    <div key={file.name}>
      <div style={thumbIconWrapper}>
        <FontAwesomeIcon icon={faXmark} style={thumbIcon} onClick={() => handleOnRemove(index)} />
      </div>
      <div style={file.isDefault ? { ...thumb, ...thumbDefault } : { ...thumb }}>
        <div style={thumbInner} onClick={() => handleOnClick(index)}>
          <img
            src={file.preview}
            style={thumbImage}
            onLoad={() => {
              URL.revokeObjectURL(file.preview)
            }}
          />
        </div>
      </div>
      <div style={thumbTitle}>{file.name}</div>
    </div>
  ))

  useEffect(() => {
    setFiles(uploadedFiles)
    return () => files.forEach(file => URL.revokeObjectURL(file.preview))
  }, [uploadedFiles])

  return (
    <div className='row'>
      {!hideUpload && (
        <div className='col-md-12'>
          <div {...getRootProps({ style })}>
            <input {...getInputProps()} /> {isDragActive ? <p>Drop the files here ...</p> : <p>Drag 'n' drop some files here, or click to select files</p>}
          </div>
        </div>
      )}
      <div className='col-md-12'>
        <aside style={thumbsContainer}>{thumbs}</aside>
      </div>
    </div>
  )
}

const baseStyle = {
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: '20px',
  borderWidth: 2,
  borderRadius: 2,
  borderColor: '#eeeeee',
  borderStyle: 'dashed',
  backgroundColor: '#fafafa',
  color: '#bdbdbd',
  outline: 'none',
  transition: 'border .24s ease-in-out'
}

const focusedStyle = {
  borderColor: '#2196f3'
}

const acceptStyle = {
  borderColor: '#00e676'
}

const rejectStyle = {
  borderColor: '#ff1744'
}

const thumbsContainer: any = {
  display: 'flex',
  flexDirection: 'row',
  flexWrap: 'wrap',
  marginTop: 16
}

const thumb: any = {
  display: 'inline-flex',
  borderRadius: 2,
  border: '1px solid #eaeaea',
  marginBottom: 16,
  marginRight: 16,
  width: 200,
  height: 200,
  padding: 4,
  boxSizing: 'border-box'
}

const thumbDefault = {
  WebkitBoxShadow: '0 0 14px 1px rgba(203, 53, 76, 1)',
  MozBoxShadow: '0 0 14px 1px rgba(203, 53, 76, 1)',
  boxShadow: '0 0 14px 1px rgba(203, 53, 76, 1)',
  borderRadius: '3%'
}

const thumbInner: any = {
  display: 'flex',
  minWidth: 0,
  overflow: 'hidden'
}

const thumbTitle: any = {
  display: 'block',
  maxWidth: '200px',
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis'
}

const thumbImage: any = {
  display: 'block',
  width: 'auto',
  height: '100%'
}

const thumbIconWrapper: any = {
  position: 'relative',
  right: '12px',
  top: '12px',
  textAlign: 'right',
  color: 'red'
}

const thumbIcon: any = {
  cursor: 'pointer'
}

export default Dropzone
