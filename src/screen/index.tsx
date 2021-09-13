import React from 'react'

import { GenerateCatalog } from './GenerateCatalog'
import { Container, Content } from './styles'

const screen: React.FC = () => {
  return (
    <Container>
      <Content>
        <h1>GERADOR DE CATÁLAGO</h1>
        <GenerateCatalog />
      </Content>
    </Container>
  )
}

export default screen
