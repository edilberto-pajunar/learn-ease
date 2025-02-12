"use client";

import withAuth from '@/components/withAuth';
import React from 'react'

const ClientSideHOC = () =>  {
  return (
    <div>page</div>
  )
}

export default withAuth(ClientSideHOC);