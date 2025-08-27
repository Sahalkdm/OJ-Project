import React, { useEffect } from 'react'
import ContestAnalysisDashboard from '../../components/contets/Analysis'
import { useOutletContext } from 'react-router-dom';

function ContestAnalytics() {

  const { contestData, fetchSectionData } = useOutletContext();
    
    useEffect(() => {
      if (!contestData?.userProblemScores) {
        fetchSectionData("userProblemScores");
      }
    }, [contestData?.userProblemScores, fetchSectionData]);

    useEffect(() => {
      if (!contestData?.submissions) {
        fetchSectionData("submissions");
      }
    }, [contestData?.submissions, fetchSectionData]);

    useEffect(() => {
      if (!contestData?.contestProblems) {
        fetchSectionData("contestProblems");
      }
    }, [contestData?.contestProblems, fetchSectionData]);

    useEffect(() => {
      if (!contestData?.registrations) {
        fetchSectionData("registrations");
      }
    }, [contestData?.registrations, fetchSectionData]);
  
    if (!contestData?.userProblemScores || !contestData?.submissions || !contestData?.registrations || !contestData?.contestProblems) {
      return <div className="flex justify-center items-center h-40">Loading...</div>;
    }

  return (
    <div>
      <ContestAnalysisDashboard 
        submissions={contestData?.submissions} 
        registrations={contestData?.registrations} 
        userProblemScores={contestData?.userProblemScores}
        problems={contestData?.contestProblems}
      />
    </div>
  )
}

export default ContestAnalytics
