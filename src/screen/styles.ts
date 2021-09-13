import styled from 'styled-components'

export const Container = styled.div`
  width: 100vw;
  height: 100vh;
  background: ${props => props.theme.backgrounds.lighter};
  overflow: hidden;
  border: 1px solid ${props => props.theme.colors.purpleDark};
  display: flex;
  flex-direction: column;

  position: relative;

  &::before {
    content: '';
    position: absolute;

    top: 0px;
    left: 0px;

    width: 100%;
    height: 40%;

    background-color: ${props => props.theme.backgrounds.darker};
  }
`

export const Content = styled.div`
  position: absolute;

  width: 100%;
  height: 100%;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  h1 {
    margin-bottom: 8px;
    color: #fff;
  }
`
