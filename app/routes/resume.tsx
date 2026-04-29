import {useState , useEffect} from 'react'
import {Link , useParams , useNavigate} from 'react-router'
import { usePuterStore } from '~/lib/puter';
import Summary from '~/components/Summary'
import ATS  from '~/components/ATS';
import Details from '~/components/Details'



const resume = () => {
    const{fs,kv} = usePuterStore();
    const {id} = useParams();
    const [imageUrl , setImageUrl] = useState('');
    const [ resumeUrl , setresumeUrl] = useState('');
    const[feedback, setFeedback] = useState<Feedback|null>(null);
    const navigate = useNavigate();

    useEffect(()=>{


        const loadResume = async ()=>{

                const resume = await kv.get(`resume:${id}`);

                if(!resume) return;

            const data = JSON.parse(resume);

        // this is for 
            const resumeblob = await fs.read(data.resumePath);
            if(!resumeblob) return;


           const pdfblob = new Blob([resumeblob] , {type:'application/pdf'});
           const resumeUrl = URL.createObjectURL(pdfblob);
           setresumeUrl(resumeUrl);



            // this is for image ui which we will display to the user
            const imageblob = await fs.read(data.imagePath);
            if(!imageblob) return;

            const imageUrl = URL.createObjectURL(imageblob);
            setImageUrl(imageUrl);



            // for feedback main thing we can do like 

            setFeedback(data.feedback);
            console.log({resumeUrl , imageUrl , feedback:data.feedback})
        }




        loadResume();
    },[id])


  return (
   <main className='pt-0'>
    <nav className="resume-nav">
        <Link to="/" className="back-button">
                <img src="/icons/back.svg" alt="logo" className="w-2.5 h-2.5" />
                <span className="text-gray-800 text-sm font-semibold">Back to Homepage</span>
        </Link>
    </nav>
    <div className="flex flex-row w-full max-lg:flex-col-reverse">
            <section className="feedback-section">
                    {   imageUrl && resumeUrl &&(

                        <div className="animate-in fade-in duration-1000 gradient-border max-sm:m-0 h-[90%] max-wxl:h-fit w-fit">
                            <a href={resumeUrl} target="_blank">

                                <img src={imageUrl} 
                                className="w-full h-full object-contain rounded-2xl" 
                                title="resume"
                                />
                            </a>
   
                        </div>
                    )
                             

                    }
            </section>

            <section className="feedback-section">
                <h2 className="text-4xl text-black font-bold">Resume Review</h2>
                {
                    feedback?(

                        <div className="flex flex-col gap-8 animate-in fade-in duration-1000">
                            <Summary feedback={feedback} />
                            <ATS score={feedback.ATS.score || 0} suggestions={feedback.ATS.tips || []} />
                            <Details feedback={feedback} />
                        </div>
                    ):(
                        <img src="" alt="" />
                    )


                }
            </section>
    </div>
   </main>
            )
        }
export default resume