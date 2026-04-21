import React from 'react'
import  {useState,useCallback} from 'react'
import {useDropzone} from 'react-dropzone'
import {formatSize} from '../lib/utils'


interface FileUploaderProps{
    onFileSelect ? :(file :File | null) => void 
}

const FileUploader = ({onFileSelect}:FileUploaderProps) => {


     const onDrop = useCallback((acceptedFiles : File[])=> {
    // Do something with the files

    const file  = acceptedFiles[0] || null

    onFileSelect?.(file)
  }, [onFileSelect])


  const maxFileSize = 20* 1024 *1024;
  const {getRootProps, getInputProps, isDragActive , acceptedFiles} = useDropzone({onDrop,

    multiple:false,
    accept:{'application/pdf' : ['.pdf']},
    maxSize:maxFileSize,
  })

  const file = acceptedFiles[0] || null;


  return (
    <div className='w-full gradient-border'>
        <div {...getRootProps()}>
      <input {...getInputProps()} />
      
      <div className='space-y-4 cursor-pointer'>
        
        {

            file ? (
                <div className='uploader-selected-file' onClick={(e)=> e.stopPropagation()}>
                        <div className='flex items-center space-x-3'>
                    <img src="/images/pdf.png" alt="pdf"  className="size-10"/>
                    <div>
                         <p className='text-sm font-medium text-gray-700 truncate max-w-xs'>
                        {file.name}
                    </p>
                    <p className='text-sm text-gray-500'>
                        {formatSize(file.size)}
                    </p>
                    </div>

                </div>
                <button className='p-2 cursor-pointer' onClick={(e)=>{

                    onFileSelect?.(null)
                }}>
                    <img src="/icons/cross.svg" alt="remove" className='w-4 h-4' />
                </button>

                </div>
                
            ):(

                <div>
                    <div className='mx-auto w-16 h-16 flex items-center justify-center mb-2'>
            <img src="/icons/info.svg" alt="upload"  className=":size-20"/>
        </div>
                        <p className='text-lg text-gray-500'>
                            <span className='font-semibold'>
                                Click to Upload 
                            </span>or drag and drop 
                        </p>

                        <p className='text-lg text-gray-500'>PDF (max 20 MB)</p>
                </div>
            )
        }
      </div>
    </div>
    </div>
  )
}

export default FileUploader




// 1024 bytes 

//KB = Bytes / 1024//
//MB = Bytes / (1024 * 1024)//
//GB = Bytes / (1024 * 1024 * 1024)//

// so i have to  convert whatever bytes is given i have to convert it to kb mb gb in a string format 
/*function formatSize(NUM){

LET NUM =1024 ;
    let KB = BYTES/1024;
    LET MB = BYTES/(1024*1024)
    LET GB = BYTES/(1024*1024*1024)






}

*/