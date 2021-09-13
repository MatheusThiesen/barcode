import { shade } from 'polished'
import styled, { keyframes } from 'styled-components'

import { defaultTheme } from '../../styles/theme'

interface ContainerProps {
  color: keyof typeof defaultTheme.colors
}

export const Container = styled.button<ContainerProps>`
  background: ${props => props.theme.colors[props.color]};
  border: 0;
  color: #fff;

  cursor: pointer;
  transition: opacity 0.2s;

  width: 100%;
  height: 72px;
  border-radius: 8px;
  text-decoration: none;
  padding: 0px !important;

  display: flex;
  align-items: center;
  overflow: hidden;

  span {
    display: block;
    background: ${props => shade(0.1, props.theme.colors[props.color])};
    width: 72px;
    height: 72px;

    display: flex;
    align-items: center;
    justify-content: center;
    transition: background-color 0.2s;
    svg {
      color: #fff;
      width: 20px;
      height: 20px;
    }
  }

  strong {
    flex: 1;
    text-align: center;
    color: #fff;
    font-size: 1rem;
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.5 !important;
  }

  &:hover {
    opacity: 0.9;
  }
`

const rotate = keyframes`
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
`

export const Loading = styled.div`
  height: 100%;

  display: flex;
  justify-content: center;
  align-items: center;

  animation: ${rotate} 2s linear infinite;

  svg {
    margin: 0;
    height: 16px;
    width: 16px;
  }
`
