"use client"
import React, { useEffect, useState } from 'react'
import { db } from '@/utils/db'
import { MockInterview } from '@/utils/schema'
import QuestionsSection from './_components/QuestionsSection'
import { eq } from 'drizzle-orm'
import RecordAnswerSection from './_components/RecordAnswerSection'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { toast } from 'sonner' // Import toast

function StartInterview({params}) {

    const [interviewData, setInterviewData] = useState()
    const [mockInterviewQuestion, setMockInterviewQuestion] = useState()
    const [activeQuestionIndex, setActiveQuestionIndex] = useState(0)
    const [answeredQuestions, setAnsweredQuestions] = useState([]);

    useEffect(() => {
        GetInterviewDetails();
    }, [])

    useEffect(() => {
        if (mockInterviewQuestion) {
            setAnsweredQuestions(new Array(mockInterviewQuestion.length).fill(false));
        }
    }, [mockInterviewQuestion]);

    const GetInterviewDetails = async () => {
        const result = await db.select().from(MockInterview).where(eq(MockInterview.mockId, params.interviewId))
        setInterviewData(result[0])
        
        const jsonMockResp = JSON.parse(result[0].jsonMockResp)
        setMockInterviewQuestion(jsonMockResp)
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