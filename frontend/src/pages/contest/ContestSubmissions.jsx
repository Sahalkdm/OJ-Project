import React, { useEffect } from 'react'
import { useOutletContext } from 'react-router-dom';
import SubmissionTableContest from '../../components/contets/SubmissionsTable';

function ContestSubmissions() {
    const { contestData, fetchSectionData } = useOutletContext();
    
    useEffect(() => {
      if (!contestData?.submissions) {
        fetchSectionData("submissions");
      }
    }, [contestData?.submissions, fetchSectionData]);
  
    if (!contestData?.submissions) {
      return <div className="flex justify-center items-center h-40">Loading...</div>;
    }

    return (
    <div>
      <div>
        {contestData?.submissions?.length > 0 
          ? <SubmissionTableContest submissions={contestData.submissions} perPage={50}/>
        : <div className="flex justify-center items-center h-40">No data avialable</div>}
      </div>
    </div>
  )
}

export default ContestSubmissions
