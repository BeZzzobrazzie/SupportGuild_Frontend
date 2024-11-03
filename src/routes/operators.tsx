import { createFileRoute } from '@tanstack/react-router'
import { OperatorsPage } from 'src/01_pages/operators-page'

export const Route = createFileRoute('/operators')({
  component: OperatorsPage,
})



