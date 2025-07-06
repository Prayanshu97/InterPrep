"use client"
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import Webcam from 'react-webcam'
import useSpeechToText from 'react-hook-speech-to-text';
import { Mic, StopCircle } from 'lucide-react'
import { toast } from 'sonner'
import { getGeminiResponse } from '@/utils/GeminiAI'
import { db } from '@/utils/db'
import { UserAnswer } from '@/utils/schema'
import { useUser } from '@clerk/nextjs'
import moment from 'moment'

function RecordAnswerSection({ mockInterviewQuestion, activeQuestionIndex, interviewData, setAnsweredQuestions }) { // Destructure setAnsweredQuestions

    const [userAnswer, setUserAnswer] = useState('')
    const {user} = useUser()
    const [loading, setLoading] = useState(false)

    const {
        error,
        interimResult,
        isRecording,
        results,
        startSpeechToText,
        stopSpeechToText,
        setResults
    } = useSpeechToText({
        continuous: true,
        useLegacyResults: false
    });

    useEffect(() => {
        results.map((result) => (
            setUserAnswer(prevAns => prevAns + result?.transcript)
        ))
    }, [results])

    useEffect(() => {
        setUserAnswer('');
        setResults([]);
        if (isRecording) {
            stopSpeechToText();
        }
    }, [activeQuestionIndex]); 

    const StartStopRecording = async () => {
        if (isRecording) {
            stopSpeechToText();
            if (userAnswer.length > 10) {
                setLoading(true); 
                try {
                    await UpdateUserAns(userAnswer); 
                    toast('Answer Recorded successfully. Proceed to next question.');
                    setAnsweredQuestions(prev => {
                        const newAnswered = [...prev];
                        newAnswered[activeQuestionIndex] = true;
                        return newAnswered;
                    });
                } catch (e) {
                    toast.error('Failed to record answer. Please try again.');
                } finally {
                    setLoading(false);
                    setUserAnswer(''); 
                    setResults([]);
                }
            } else if (userAnswer.length > 0 && userAnswer.length <= 10) {
                toast('Your answer is too short. Please provide a more detailed response.');
                setUserAnswer('');
                setResults([]);
            } else if (userAnswer.length === 0) {
                toast('No answer recorded. Please speak into the microphone.');
                setResults([]);
            }
        } else {
            startSpeechToText();
            setUserAnswer(''); 
            setResults([]);
        }
    };

    const UpdateUserAns = async (answerToSave) => {
        const feedbackPrompt = "Question: " + mockInterviewQuestion[activeQuestionIndex]?.question + "User Answer: " + answerToSave + ", Depends on question and user answer for given intereview question please give us rating for user answer and feedback as area of improvement if any in just 3-5 lines to improve it in JSON format with rating field and feedback field."
        
        const result = await getGeminiResponse(feedbackPrompt)

        const mockJsonResp = result.replace('```json', '').replace('```','')

        const jsonFeedbackResp = JSON.parse(mockJsonResp);

        const resp = await db.insert(UserAnswer)
            .values({
                mockIdRef: interviewData?.mockId,
                question: mockInterviewQuestion[activeQuestionIndex]?.question,
                correctAns: mockInterviewQuestion[activeQuestionIndex]?.answer,
                userAns: answerToSave, // Use the passed answer
                feedback: jsonFeedbackResp?.feedback,
                rating: jsonFeedbackResp?.rating,
                userEmail: user?.primaryEmailAddress.emailAddress,
                createdAt: moment().format('DD-MM-YYYY')
            })

        if(!resp){
            throw new Error("Failed to save answer to database."); 
        }
    }

 return (
    <div className='flex items-center justify-center flex-col'>
        <div className='flex flex-col mt-10 justify-center items-center bg-secondary rounded-lg p-5'>
            <Image src={'/webcam.png'} width={200} height={200} className='absolute' />
            <Webcam
            mirrored={true}
            style={{ height: 300, width: '100%', zIndex: 10, 
            }}
            />
        </div>
        <Button disabled={loading} variant="outline" className="my-5 cursor-pointer"
        onClick={StartStopRecording}
        >
            {isRecording?
                <h2 className='text-red-600 flex gap-2 items-center'> <StopCircle/> Stop Recording.</h2>
                :
                <h2 className='text-primary flex gap-2 items-center'><Mic/> Record Answer</h2>
            }         
        </Button>

    </div>
 )
}

export default RecordAnswerSection