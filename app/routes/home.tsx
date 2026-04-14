import type { Route } from "./+types/home";
import Navbar from '~/components/navbar'
import ResumeCard from '~/components/resumecard'
import {resumes} from '../../constants/index'
import {Link, useNavigate} from "react-router";
import { usePuterStore } from "~/lib/puter";
import {useEffect} from 'react'
export function meta({}: Route.MetaArgs) {
  return [
    { title: "Resumind" },
    { name: "description", content: "Smart feedback for your dream job!" },
  ];
}

export default function Home() {

  const {auth} = usePuterStore();
  const navigate = useNavigate();
  useEffect(()=>{

    if(!auth.isAuthenticated) navigate('/auth?next=/')
  },[])
  return <main className="bg-[url('/images/bg-main.svg')] bg-cover">
    <Navbar />
    <section className="main-section">
          <div className="page-heading">
            <h1>Track your Applications & Resume Ratings</h1>
            <h2>Review your submissions and check AI-powered feedback.</h2>

          </div>
    

          {resumes.length > 0 && (
        
        <div className="grid grid-cols-3 gap-8">
          {resumes.map((resume:Resume)=>(

            <ResumeCard key={resume.id} resume={resume} />
          ))}
        </div>
          )}

    </section>
  </main>
}
