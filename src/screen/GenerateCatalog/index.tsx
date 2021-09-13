import React from 'react'

import GenerateCaralogForm from './GenerateCaralogForm'

import { Container, Content } from './styled'

export const GenerateCatalog: React.FC = () => {
  return (
    <Container>
      <Content>
        <GenerateCaralogForm />
      </Content>
    </Container>
  )
}
