import React, { ButtonHTMLAttributes, memo } from 'react'
import { FiLoader } from 'react-icons/fi'
import { IconType } from 'react-icons'

import { defaultTheme } from '../../styles/theme'
import { Container, Loading } from './styles'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean
  color: keyof typeof defaultTheme.colors
  Icon: IconType
  name: string
}

const ButtonPartIcon: React.FC<ButtonProps> = ({
  color = 'pink',
  type = 'button',
  loading = false,
  Icon,
  name,
  ...rest
}) => {
  return (
    <Container disabled={loading} color={color} type={type} {...rest}>
      {loading ? (
        <Loading>
          <FiLoader />
        </Loading>
      ) : (
        <>
          <span>
            <Icon />
          </span>
          <strong>{name}</strong>
        </>
      )}
    </Container>
  )
}

export default memo(ButtonPartIcon)
