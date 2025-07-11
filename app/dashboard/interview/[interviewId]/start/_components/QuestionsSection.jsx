"use client"
import { Lightbulb, Volume2 } from 'lucide-react'
import React, { useEffect, useState } from 'react'

function QuestionsSection( {mockInterviewQuestion, activeQuestionIndex, answeredQuestions, onQuestionClick}) { 
    const [isClient, setIsClient] = useState(false)

    useEffect(() => {
        setIsClient(true)
    }, [])

    const textToSpeech = (text) => {
        if (typeof window !== 'undefined' && 'speechSynthesis' in window){
            const speech = new SpeechSynthesisUtterance(text)
            window.speechSynthesis.speak(speech)
        } else {
            alert('Sorry, Your browser does not support text to speech.')
        }
    }

  return mockInterviewQuestion && (
    <div className='p-5 border rounded-lg my-10'>
        <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5'>
            {mockInterviewQuestion && mockInterviewQuestion.map((question, index) =>(
                <h2 key={index} 
                className={`p-2 rounded-full text-xs md:text-sm text-center cursor-pointer 
                    ${activeQuestionIndex === index ? 'bg-primary text-white' : 
                    answeredQuestions[index] ? 'bg-green-500 text-white' : 'bg-secondary'}`}
                onClick={() => onQuestionClick(index)} 
                >
                    Question #{index + 1}
                </h2>
            ))}
        </div>

        <h2 className='my-5 text-md md:text-lg'> 
            {mockInterviewQuestion[activeQuestionIndex]?.question} 
        </h2>

        {isClient && (
            <Volume2 className='cursor-pointer' onClick={() => textToSpeech(mockInterviewQuestion[activeQuestionIndex]?.question)}/>
        )}

        <div className='border rounded-lg p-5 bg-blue-100 mt-20'>
            <h2 className='flex gap-2 items-center text-primary'>
                <Lightbulb/>
                <strong>Note:</strong>
            </h2>
            <h2 className='text-sm text-primary my-2'>
                {process.env.NEXT_PUBLIC_QUESTION_NOTE}
            </h2>
        </div>
    </div>
  )
}

export default QuestionsSection