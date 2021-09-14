import React, { useEffect, useState } from 'react'
import { FaFileDownload } from 'react-icons/fa'
import { FiAlertCircle } from 'react-icons/fi'
import { IoMdTrash } from 'react-icons/io'
import { RiFileExcel2Fill } from 'react-icons/ri'

import { ipcRenderer } from 'electron'
import filesize from 'filesize'

import ButtonPartIcon from '../../../components/ButtonPartIcon'
import Dropzone from '../../../components/Dropzone'
import Modal from '../../../components/Modal'
import Loading from '../../../components/Loading'
import { useToast } from '../../../context/toast'
import {
  ActionsContainer,
  ContainerDropZone,
  ContainerPreviews,
  ErrorDropzone
} from './styles'

const GenerateCaralogForm: React.FC = () => {
  const { addToast } = useToast()

  const [loading, setLoading] = useState(false)
  const [fileError, setFileError] = useState(false)
  const [file, setFile] = useState<File | undefined>()

  const handleCreateOrUpdateConnection = async () => {
    try {
      if (!file) {
        setFileError(true)
        return
      }

      ipcRenderer.send('generate-barcode', file.path)

      addToast({
        type: 'success',
        title: 'Gerado com sucesso',
        description: ''
      })
      setLoading(false)
      setFile(undefined)
    } catch (err) {
      console.log(err)

      addToast({
        type: 'error',
        title: 'Error interno',
        description: ''
      })
      setLoading(false)
    }
  }

  const downloadDefaultFile = () => {
    ipcRenderer.send('download-default-file', 'templete.xls')
  }

  return (
    <>
      <div>
        {/* <DownloadFile className="download-file">
          <button type="button" onClick={downloadDefaultFile}>
            Baixar planilha modelo
            <span>
              <RiFileExcel2Fill color="#207245" size={20} />
              <MdArrowDownward color="#207245" size={14} />
            </span>
          </button>
        </DownloadFile> */}
        <ContainerDropZone>
          <Dropzone
            accept={[
              'application/vnd.ms-excel',
              'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
            ]}
            onFileUploaded={file => {
              setFileError(false)
              setFile(file)
            }}
          />
          {fileError && (
            <ErrorDropzone>
              <FiAlertCircle color="#E96379" size={22} />
              <span>Arquivo é obrigatório</span>
            </ErrorDropzone>
          )}

          <ContainerPreviews>
            {file && (
              <li key={`${file.name}`}>
                <RiFileExcel2Fill size={60} color="#207245" />
                <div className="fileInfo">
                  <div>
                    <strong>{file.name}</strong>
                    <span>{filesize(file.size)}</span>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setFile(undefined)
                    }}
                  >
                    <IoMdTrash size={30} />
                  </button>
                </div>
              </li>
            )}
          </ContainerPreviews>
        </ContainerDropZone>

        <ActionsContainer>
          <ButtonPartIcon
            Icon={FaFileDownload}
            name="GERAR"
            color="opaque"
            type="button"
            onClick={handleCreateOrUpdateConnection}
          />
        </ActionsContainer>
      </div>

      {loading && (
        <Modal visible={true} isClose={true}>
          <Loading
            size={40}
            borderSize={3}
            colorLoading="rgba(255,255,255)"
            borderColor="rgba(255,255,255, 0.3)"
          />
        </Modal>
      )}
    </>
  )
}

export default GenerateCaralogForm
