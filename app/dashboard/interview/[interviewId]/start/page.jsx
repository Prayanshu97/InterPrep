"use client"
import React, { useEffect, useState } from 'react'
import { db } from '@/utils/db'
import { MockInterview } from '@/utils/schema'
import QuestionsSection from './_components/QuestionsSection'
import { eq } from 'drizzle-orm'
import RecordAnswerSection from './_components/RecordAnswerSection'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { toast } from 'sonner' 

function StartInterview({params}) {

    const [interviewData, setInterviewData] = useState()
    const [mockInterviewQuestion, setMockInterviewQuestion] = useState()
    const [activeQuestionIndex, setActiveQuestionIndex] = useState(0)
    const [answeredQuestions, setAnsweredQuestions] = useState([]);
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        GetInterviewDetails();
    }, [])

    useEffect(() => {
        if (mockInterviewQuestion) {
            setAnsweredQuestions(new Array(mockInterviewQuestion.length).fill(false));
        }
    }, [mockInterviewQuestion]);

    const GetInterviewDetails = async () => {
        try {
            setLoading(true)
            const result = await db.select().from(MockInterview).where(eq(MockInterview.mockId, params.interviewId))
            
            if (!result || result.length === 0) {
                toast.error('Interview not found')
                return
            }
            
            setInterviewData(result[0])

            let jsonMockResp
            try {
                const cleanedJson = result[0].jsonMockResp.trim().replace(/\s+/g, ' ')
                jsonMockResp = JSON.parse(cleanedJson)
            } catch (parseError) {
                console.error('JSON Parse Error:', parseError)
                toast.error('Failed to load interview questions. Please try again.')
                return
            }
            
            setMockInterviewQuestion(jsonMockResp)
        } catch (error) {
            console.error('Error fetching interview details:', error)
            toast.error('Failed to load interview. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    const handleNextQuestion = () => {
        if (answeredQuestions[activeQuestionIndex]) {
            setActiveQuestionIndex(prevIndex => prevIndex + 1);
        } else {
            toast.error('Please record your answer for the current question before proceeding.');
        }
    };

    const handleQuestionClick = (index) => {
        if (index === activeQuestionIndex) {
            return; 
        }
        if (index < activeQuestionIndex && answeredQuestions[index]) {
            setActiveQuestionIndex(index);
        } else if (index > activeQuestionIndex) {
            if (answeredQuestions[activeQuestionIndex]) {
                setActiveQuestionIndex(index);
            } else {
                toast.error('Please answer the current question before skipping ahead.');
            }
        } else {
            toast.error('Please record your answer for the current question before moving.');
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
                    <p className="mt-4 text-lg">Loading interview...</p>
                </div>
            </div>
        )
    }

    if (!mockInterviewQuestion) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <p className="text-lg text-red-600">Failed to load interview questions</p>
                    <Button onClick={GetInterviewDetails} className="mt-4">Retry</Button>
                </div>
            </div>
        )
    }

 return (
    <div>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-10'>
            <QuestionsSection 
                mockInterviewQuestion={mockInterviewQuestion} 
                activeQuestionIndex={activeQuestionIndex} 
                answeredQuestions={answeredQuestions} 
                onQuestionClick={handleQuestionClick} 
            />
            <RecordAnswerSection 
                mockInterviewQuestion={mockInterviewQuestion} 
                activeQuestionIndex={activeQuestionIndex} 
                interviewData={interviewData} 
                setAnsweredQuestions={setAnsweredQuestions}
            />
        </div>

        <div className='flex justify-end gap-5 pb-5'>
            {activeQuestionIndex > 0 && 
            <Button onClick={() => setActiveQuestionIndex(activeQuestionIndex - 1)}>Previous Question</Button>}
            
            {activeQuestionIndex !== mockInterviewQuestion?.length - 1 && 
            <Button onClick={handleNextQuestion}>Next Question</Button>}
            
            <Link href={'/dashboard/interview/'+interviewData?.mockId+'/feedback'}>
                {activeQuestionIndex === mockInterviewQuestion?.length - 1 &&
                <Button>End Interview</Button>}
            </Link>
        </div>
    </div>
 )
}

export default StartInterview