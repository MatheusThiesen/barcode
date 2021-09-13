import styled from 'styled-components'

export const Spinner = styled.div`
  height: 25px;
  width: 25px;

  border-radius: 50px;
  border: 3px solid rgba(255, 255, 255, 0.3);
  border-left-color: rgba(255, 255, 255);

  animation: spin 0.5s linear infinite;

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`
