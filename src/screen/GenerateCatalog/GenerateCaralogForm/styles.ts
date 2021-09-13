import styled from 'styled-components'

import Button from '../../../components/Button'

export const ActionsContainer = styled.div`
  display: flex;
  flex: 1;
  flex-direction: row;
  justify-content: space-between;
  margin-top: 24px;

  button {
    padding: 10px 16px;
  }
`

export const InputGroup = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  margin-top: 16px;

  > div {
    margin-top: 0 !important;
  }

  div:first-child {
    /* flex: 3; */
  }

  div + div {
    margin-left: 16px;
  }

  .btn-open-dir {
    cursor: pointer;
    background-color: transparent;
    border: none;
    font-size: 1.5rem;

    margin-top: auto;
    margin-bottom: 0.7rem;
    padding: 0 8px;
  }
`

export const ButtonGroup = styled.div`
  display: flex;
  flex-direction: row;

  button {
    &:first-child {
      margin-right: 8px;
    }
  }
`

export const TestConnectionButton = styled(Button)`
  width: 155px;
`

export const ContainerDropZone = styled.div`
  width: 100%;
  margin-top: 20px;
`

export const ContainerPreviews = styled.ul`
  margin-top: 10px;
  width: 100%;

  display: flex;
  justify-content: flex-start;

  li {
    display: flex;
    align-items: center;

    width: 100%;
    display: flex;
    background: #fff;
    padding: 3px 3px;
    border-radius: 8px;

    img {
      height: 60px;
    }

    @media (max-width: 900px) {
      img {
        height: 40px;
        width: 40px;
      }
    }

    strong {
      word-break: break-all;
    }

    .fileInfo {
      color: ${props => props.theme.colors.opaque};

      margin-left: 5px;
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: flex-start;
      width: 100%;

      div {
        display: flex;
        flex-direction: column;
        margin: 0 5px;
      }

      button {
        border: none;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        height: 100%;
        margin-right: 10px;
        background: none;
        color: #f00;
      }
    }
  }
`

export const ErrorDropzone = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  margin-top: 10px;

  span {
    font-size: 0.9rem;
    margin-left: 4px;
    color: #e96379;
  }
`

export const DownloadFile = styled.nav`
  margin-top: 2rem;
  margin-bottom: 10px;

  display: flex;
  align-items: center;
  justify-content: flex-end;

  button {
    border: none;
    cursor: pointer;
    width: 230px;
    padding: 4px 0px 4px 2px;

    display: flex;
    align-items: center;
    justify-content: center;

    border-radius: 20px;
    background: rgba(200, 200, 200, 0.8);
    box-shadow: 0 0 1px rgba(0, 0, 0, 0.2);

    &:hover {
      background: rgba(180, 180, 180, 0.8);
    }
    span {
      margin-left: 6px;
      margin-top: 2px;
    }

    display: flex;
    align-items: center;
    text-decoration: none;

    color: #333;
    font-size: 16px;
    font-weight: 500;
  }
`
