import React from 'react'
import {PROBLEMS} from '../data/problem';

function CreateSessionModal({isOpen, onClose, roomConfig, setRoomConfig, onCreateRoom, isCreating}) {
    const problems = Object.values(PROBLEMS)
    if(!isOpen) return null


  return (
    <>
    <div className='modal modal-open'>
        <div className='modal-boz max-2-xl'>
            <h3 className='font-bold text-2xl space-y-8 mb-6'>
            Create New Session
            </h3>
             {/* Problem Selection */}
             <div className='space-y-2'>
                <label className="label">
                    <span className='label-text font-semibold'>Select a Problem</span>
                    <span className='label-text-alt text-error'>*</span>
                    <select className='select w-full' value={roomConfig.problem} onChange={(e) =>{
                        const selectedProblem = problems.find(p => p.title === e.target.value)
                        setRoomConfig({
                            difficulty:selectedProblem.difficulty,
                            problem: e.target.value
                        })
                    }}>
                        <option value="" disabled>Choose a Problem</option>
                        {
                            problems.map((problem) =>(
                                <option key= {problem.id} value={problem.title}>
                                    {problem.title}-({problem.difficulty})
                                </option>
                            ))
                        }
                    </select>
                </label>
             </div>
        </div>
    </div>
    </>
  )
}

export default CreateSessionModal
