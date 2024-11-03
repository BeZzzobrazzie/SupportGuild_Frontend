import { createFileRoute } from '@tanstack/react-router'
import { TemplatesPage } from 'src/01_pages/templates-page'

export const Route = createFileRoute('/')({
  component: TemplatesPage,
})
