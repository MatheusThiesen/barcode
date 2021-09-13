import React, { useState, useCallback, useEffect, memo } from 'react'
import ReactModal from 'react-modal'

import { Container } from './styles'

export interface SharedModalProps {
  visible?: boolean
  isClose?: boolean
  onRequestClose?: () => void
}

type ModalProps = React.PropsWithChildren<SharedModalProps>

const Modal: React.FC<ModalProps> = ({
  visible = false,
  onRequestClose,
  isClose,
  children
}) => {
  const [isOpen, setIsOpen] = useState(visible)

  useEffect(() => {
    setIsOpen(visible)
  }, [visible])

  const handleModalClose = useCallback(() => {
    if (onRequestClose) {
      onRequestClose()
    }

    setIsOpen(false)
  }, [onRequestClose])

  return (
    <ReactModal
      appElement={document.getElementById('modal') as HTMLElement}
      shouldCloseOnEsc={true}
      onRequestClose={isClose ? undefined : handleModalClose}
      overlayClassName="modal-overlay"
      className="modal-content"
      isOpen={isOpen}
    >
      <Container>{children}</Container>
    </ReactModal>
  )
}

export default memo(Modal)
