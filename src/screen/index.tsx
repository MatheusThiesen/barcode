import React from 'react'

import { GenerateCatalog } from './GenerateCatalog'
import { Container, Content } from './styles'

const screen: React.FC = () => {
  return (
    <Container>
      <Content>
        <h1>Gerador de Código de barras</h1>
        <GenerateCatalog />
      </Content>
    </Container>
  )
}

export default screen
