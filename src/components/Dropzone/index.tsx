import React, { useCallback } from 'react'
import { useDropzone } from 'react-dropzone'

import { DropContainer } from './styles'

interface IHeaderProps {
  onFileUploaded: (file: File) => void
  accept: string[]
}

const Dropzone: React.FC<IHeaderProps> = ({ onFileUploaded, accept }) => {
  const onDrop = useCallback(
    acceptedFiles => {
      acceptedFiles.forEach((element: File) => {
        onFileUploaded(element)
      })
    },
    [onFileUploaded]
  )
  const {
    getRootProps,
    getInputProps,
    isDragActive,
    isDragReject
  } = useDropzone({
    onDrop,
    accept: [...accept]
  })

  function rederDragMessage() {
    if (!isDragActive) return 'Arraste o arquivo aqui...'

    if (isDragReject) return 'Arquivo não suportado'

    return 'Solte os arquivos aqui'
  }

  function generateAccept(): string {
    let data = ''

    if (accept) {
      for (const item of accept) {
        data += `${item},`
      }
    }

    return data
  }

  function styleBorder() {
    if (!isDragActive) return {}

    if (isDragReject) return { borderColor: '#cf1717' }

    return { borderColor: '#20c71a' }
  }

  return (
    <DropContainer style={styleBorder()} {...getRootProps()}>
      <input {...getInputProps()} accept={generateAccept()} />
      <span>{rederDragMessage()}</span>
    </DropContainer>
  )
}

export default Dropzone
