import styled from 'styled-components'

export const DropContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;

  height: 55px;
  border: 3px dashed ${props => props.theme.colors.opaque};
  border-radius: 4px;
  cursor: pointer;
  transition: height 0.2s ease;

  span {
    font-weight: 700;
    font-size: 14px;
    color: ${props => props.theme.colors.opaque};
  }
`

export const UploadMessage = styled.p`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 15px 0;
`
