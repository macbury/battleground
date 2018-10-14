import React from 'react'
import Sidebar from '@components/Sidebar'

export default function LayoutWithSidebar({ children }) {
  return (
    <div className="content-with-sidebar">
      <Sidebar/>
      <div className="container-fluid">{children}</div>
    </div>
  )
}
