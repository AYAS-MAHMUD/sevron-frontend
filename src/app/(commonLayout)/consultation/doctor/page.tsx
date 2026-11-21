import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query'
import React from 'react'
import { getDoctors } from './_action';
import DoctorList from '@/components/module/consultation/DoctorList';

const ConsultationPage = async () => {

  const queryClient = new QueryClient();
  
  await queryClient.prefetchQuery({
    queryKey : ["doctor"],
    queryFn : getDoctors
  })


  return (
    <HydrationBoundary state={dehydrate(queryClient)}> 
      <DoctorList/>
    </HydrationBoundary>
  )
}

export default ConsultationPage