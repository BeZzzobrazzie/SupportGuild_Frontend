import * as React from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { OrganizationInfoPage } from 'src/01_pages/organization-info-page'

export const Route = createFileRoute('/organization-info')({
  component: OrganizationInfoPage,
})


