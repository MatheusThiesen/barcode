import React, {
  useState,
  useCallback,
  InputHTMLAttributes,
  useRef,
  useEffect,
  memo
} from 'react'
import { FiAlertCircle } from 'react-icons/fi'

import { useField } from '@unform/core'

import { Container, TitleContainer, InputContainer } from './styles'

interface InputProps extends InputHTMLAttributes<HTMLSelectElement> {
  name: string
  label?: string
  hint?: string
  notView?: boolean
}

const Select: React.FC<InputProps> = ({
  label,
  name,
  hint,
  notView,
  children,
  ...rest
}) => {
  const inputRef = useRef<HTMLSelectElement>(null)
  const {
    fieldName,
    registerField,
    defaultValue,
    error,
    clearError
  } = useField(name)

  const [isFocused, setIsFocused] = useState(false)

  useEffect(() => {
    if (inputRef.current) {
      registerField({
        name: fieldName,
        path: 'value',
        ref: inputRef.current
      })
    }
  }, [registerField, fieldName])

  const handleInputFocus = useCallback(() => {
    setIsFocused(true)

    clearError()
  }, [clearError])

  const handleInputBlur = useCallback(() => {
    setIsFocused(false)
  }, [])

  return (
    <Container style={{ display: notView ? 'none' : undefined }}>
      <TitleContainer>
        {label && <label htmlFor={fieldName}>{label}</label>}
        {hint && <small>{hint}</small>}
      </TitleContainer>

      <InputContainer
        isFocused={isFocused}
        isErrored={!!error}
        onFocus={handleInputFocus}
      >
        <select
          ref={inputRef}
          defaultValue={defaultValue}
          {...rest}
          onBlur={handleInputBlur}
        >
          {children}
        </select>

        {!!error && <FiAlertCircle />}
      </InputContainer>
    </Container>
  )
}

export default memo(Select)
