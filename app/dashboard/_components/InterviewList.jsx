"use client"
import { db } from '@/utils/db'
import { MockInterview } from '@/utils/schema'
import { useUser } from '@clerk/nextjs'
import { desc, eq } from 'drizzle-orm'
import React, { useEffect, useState } from 'react'
import InterviewItemCard from './InterviewItemCard'
import InterviewItemSkeleton from './InterviewItemSkeleton'

function InterviewList() {

  const { user } = useUser()
  const [interviewList, setInterviewList] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user) {
      GetInterviewList()
    }
  }, [user])

  const GetInterviewList = async () => {
    setLoading(true)
    const result = await db.select()
      .from(MockInterview)
      .where(eq(MockInterview.createdBy, user?.primaryEmailAddress.emailAddress))
      .orderBy(desc(MockInterview.id))

    setInterviewList(result)
    setLoading(false)
  }

  return (
    <div>
      <h2 className='font-medium text-xl'>Previous Mock Interview</h2>

      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 my-3'>
        {loading
          ? Array.from({ length: 6 }).map((_, i) => <InterviewItemSkeleton key={i} />)
          : interviewList.map((interview, index) => (
              <InterviewItemCard interview={interview} key={index} />
            ))
        }
      </div>
    </div>
  )
}

export default InterviewList
