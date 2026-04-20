import {useEffect} from 'react'
import Navbar from '~/components/navbar';
import {useState , type FormEvent} from 'react'
import FileUploader from '~/components/Fileuploader';
import {useNavigate} from 'react-router'
import {usePuterStore} from '~/lib/puter'
import {convertPdfToImage} from '~/lib/pdftoimg'
import {generateUUID}   from '~/lib/UUid';
import {prepareInstructions} from '../../constants';


const Upload = () => {

    const {auth , fs , isLoading , ai , kv , puterReady , init} = usePuterStore();

    useEffect(() => {
    console.log('init called')
    init();
}, []);
    const navigate = useNavigate();
    const [isProcessing , setIsProcessing] = useState(false);
    const [ statusText , setStatusText] = useState('');
    const[ file , setFile] = useState<File | null>(null)


    const handleFileSelect=(file:File | null)=>{
        setFile(file)
    }

    // here we can declaree
    const handleAnalyze = async ({companyName , jobTitle , jobDescription ,  file}: {companyName:string , jobTitle:string , jobDescription : string , file:File})=>{

                setIsProcessing(true);

        setStatusText('Uploading the file ...')

        console.log('1. file:', file)
    console.log('2. puterReady:', puterReady)
    console.log('3. isAuthenticated:', auth.isAuthenticated)
    
    const uploadFile = await fs.upload([file]);
    console.log('4. uploadFile:', uploadFile)  

    if(!uploadFile) return setStatusText('Error:Failed to upload ...');

    // if we pass this above if statement then we can redeclare the statustext with this statement
    setStatusText('Converting to image....')
    console.log('5. converting pdf to image...')
        const imageFile = await convertPdfToImage(file);
        console.log('6. imageFile:', imageFile)  
        if(!imageFile.file) return setStatusText('Error:Failed to upload File');
    setStatusText('Uploading Image...')
        const uploadedImage = await fs.upload([imageFile.file])
        if(!uploadedImage) return setStatusText('Error:Failed to upload Image');
    

        setStatusText('Preparing data...');
       const uuid = generateUUID();

    const data={

        id:uuid,
        resumePath:uploadFile.path,
        imagePath:uploadedImage.path,
        companyName,jobTitle , jobDescription,
        feedback:'',

    }
    await kv.set(`resume:${uuid}` , JSON.stringify(data));

    setStatusText('Analyzing ...')


    // now next step we have to call ai and send the file along with the instructions//

    const feedback= await ai.feedback(

            uploadFile.path,
            prepareInstructions({jobTitle , jobDescription})

    )
    if(!feedback) return setStatusText('Error : Failed to analyze resume');

    const feedbackText = typeof feedback.message.content === 'string'

        ? feedback.message.content
        : feedback.message . content[0].text;


    data.feedback = JSON.parse(feedbackText);
    await kv.set(`resume:${uuid}` , JSON.stringify(data));
    setStatusText('Analysis complete , redricting...');
   
        navigate(`/resume/${uuid}`)

}




    const handleSubmit = (e:FormEvent<HTMLFormElement>)=>{

            e.preventDefault()
        const form = e.currentTarget.closest('form')
        if(!form) return;

        const formData = new FormData(form);
    const companyName = formData.get('company-name') as string;
    const jobTitle = formData.get('jobTitle') as string;
    const jobDescription = formData.get('jobDescription') as string


    if(!file) return;

    handleAnalyze({companyName, jobTitle , jobDescription , file})

    // Now we have to declare this functionn handleAnalyze and setproperties //
    // with this value destructured //
    
    }


  return (

    <main  className="bg-[url('/images/bg-main.svg')] bg-cover">

        <Navbar />

        <section className='main-section'>
            <div className='page-heading'>
                <h1>Smart feedback for your dream job</h1>
                {isProcessing? (

                     <>
                     <h2>{statusText}</h2>
                     <img src="/images/resume-scan.gif" alt="" className="w-full" />
                     
                     </>   
                ):(

                    <h2>Drop your resume for an ATS Score and improvement tips</h2>
                )}
                {
                    !isProcessing && (

                        <form id='upload-form' onSubmit = {handleSubmit} className='flex flex-col gap-4 mt-8'>

                            <div className='form-div'>
                                <label htmlFor="company-name">Company name</label>
                                <input type="text" name='company-name' placeholder='Company Name' id='company-name' />
                            </div>
                            <div className='form-div'>
                                <label htmlFor="job-title">Job Title</label>
                                <input type="text" name='job-title' placeholder='Job Title' id='job-title' />
                            </div>
                            <div className='form-div'>
                                <label htmlFor="job-description">Job-description</label>
                                <textarea rows={5} name='job-description' placeholder='Job Description' id='job-description' />
                            </div>


                             <div className='form-div'>
                                <label htmlFor="uploader">Upload Resume</label>
                               <FileUploader onFileSelect={handleFileSelect} />
                            </div>


                            <button className="primary-button"  type="submit">
                                    Analyze Resume
                            </button>
                        </form >
                    )
                }
            </div>
        </section>




    </main>


  )
}

export default Upload;