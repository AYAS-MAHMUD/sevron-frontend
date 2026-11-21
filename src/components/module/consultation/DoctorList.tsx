"use client"
import { getDoctors } from '@/app/(commonLayout)/consultation/doctor/_action'
import { useQuery } from '@tanstack/react-query'
import React from 'react'

const DoctorList = () => {
    const {data} = useQuery({
        queryKey : ["doctor"],
        queryFn : ()=> getDoctors()
    })
    console.log("data", data)
  return (
    <div>
      {data?.data.doctors.map((doctor) => (
        <div key={doctor.id}>{doctor.name}</div>
      ))}
    </div>
  )
}

export default DoctorList