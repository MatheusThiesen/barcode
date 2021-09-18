import styled from 'styled-components'

export const Container = styled.div`
  padding: 12px 12px 6px 12px;
  position: relative;

  h1 {
    font-size: 18px;
    margin-bottom: 32px;
  }

  hr {
    margin: 16px 0;
    height: 1px;
    width: 100%;
    border: 0;
    background: ${props => props.theme.backgrounds.darker};
  }
`
