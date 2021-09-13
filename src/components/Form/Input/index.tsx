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

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  name: string
  label?: string
  hint?: string
  notView?: boolean
}

const Input: React.FC<InputProps> = ({
  label,
  name,
  hint,
  notView,
  ...rest
}) => {
  const inputRef = useRef<HTMLInputElement>(null)
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
    <Container
      style={notView ? { position: 'absolute', opacity: 0 } : undefined}
    >
      <TitleContainer>
        {label && <label htmlFor={fieldName}>{label}</label>}
        {hint && <small>{hint}</small>}
      </TitleContainer>

      <InputContainer
        isFocused={isFocused}
        isErrored={!!error}
        onFocus={handleInputFocus}
      >
        <input
          ref={inputRef}
          defaultValue={defaultValue}
          {...rest}
          onBlur={handleInputBlur}
        />

        {!!error && <FiAlertCircle />}
      </InputContainer>
    </Container>
  )
}

export default memo(Input)
