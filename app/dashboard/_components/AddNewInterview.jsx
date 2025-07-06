"use client" // as we used useState 
import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { v4 as uuidv4 } from 'uuid';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Textarea } from '@/components/ui/textarea'
import { getGeminiResponse } from '@/utils/GeminiAI'
import { LoaderCircle } from 'lucide-react'
import { db } from '@/utils/db'
import { useUser } from '@clerk/nextjs';
import moment from 'moment/moment';
import { MockInterview } from '@/utils/schema';
import { useRouter } from 'next/navigation';

function AddNewInterview() {

  const [openDialog, setOpenDialog] = useState(false)
  const [jobPosition, setjobPosition] = useState()
  const [jobDesc, setjobDesc] = useState()
  const [jobExperience, setjobExperience] = useState()
  const [loading, setLoading] = useState(false)
  const [jsonResponse, setJsonResponse] = useState([])
  const router = useRouter()
  
  const {user} = useUser() // from clerk

  const onSubmit = async (e) => {
    setLoading(true)
    e.preventDefault()

    const InputPrompt = "Job Position: "+jobPosition+", Job Description: "+jobDesc+", Years of Experience: "+jobExperience+". Depending on these details give me "+process.env.NEXT_PUBLIC_INTERVIEW_QUESTION_COUNT+" interview questions along with their answers in json format. The output should be like one question its answer, then next question its answer and so on."

    const result = await getGeminiResponse(InputPrompt)

    const MockJsonResp = result.replace('```json', '').replace('```','')

    setJsonResponse(MockJsonResp)

    if(MockJsonResp){

      const resp = await db.insert(MockInterview)
      .values({
        mockId: uuidv4(),
        jsonMockResp: MockJsonResp,
        jobPosition: jobPosition,
        jobDesc: jobDesc,
        jobExperience: jobExperience,
        createdBy: user?.primaryEmailAddress?.emailAddress,
        createdAt: moment().format('DD-MM-YYYY')
      })
      .returning({
        mockId: MockInterview.mockId
      })
      

      if(resp){
        setOpenDialog(false)
        router.push('/dashboard/interview/' + resp[0]?.mockId)
      }
    }

    setLoading(false)

  }

 
  return (
    <div>
        <div className='p-10 border rounded-lg bg-secondary hover:scale-105 hover:shadow-md cursor-pointer transition-all' onClick={() => setOpenDialog(true)}>
            <h2 className='text-lg text-center'>+ Add New</h2>
        </div>
      <Dialog open={openDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl">Tell us more about your job interview</DialogTitle>
            <DialogDescription>
              <form onSubmit={onSubmit}>              
                <div>
                  <h2>Add details about your job</h2>

                  <div className='my-3'>
                    <label>Job Role</label>
                    <Input placeholder="Ex. Full Stack Developer" required onChange={(event) => setjobPosition(event.target.value)}/>
                  </div>

                  <div className='my-3'>
                    <label>Job Description / Tech Stack</label>
                    <Textarea placeholder="Ex. React, Angular" required onChange={(event) => setjobDesc(event.target.value)}/>
                  </div>

                  <div className='my-3'>
                    <label>Years of Experience</label>
                    <Input placeholder="Ex. 2" type="number" max="50" required onChange={(event) => setjobExperience(event.target.value)}/>
                  </div>

                </div>
                <div className='flex gap-5 justify-end'>
                  <Button type="button" variant="ghost" onClick={() => setOpenDialog(false)}>Cancel</Button>
                  <Button type="submit" disabled={loading}>
                    {loading? 
                    <><LoaderCircle className='animate-spin' /> 'Generating from AI'</>
                    : 
                    'Start Interview'}
                  </Button>
                </div>
              </form>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default AddNewInterview