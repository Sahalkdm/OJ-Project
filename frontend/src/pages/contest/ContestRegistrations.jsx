import React, { useEffect } from 'react'
import RegistrationsTable from '../../components/contets/RegistrationsTable';
import { useOutletContext } from 'react-router-dom';

function ContestRegistrations() {

  const { contestData, fetchSectionData } = useOutletContext();
    
    useEffect(() => {
      if (!contestData?.registrations) {
        fetchSectionData("registrations");
      }
    }, [contestData?.registrations, fetchSectionData]);
  
    if (!contestData?.registrations) {
      return <div className="flex justify-center items-center h-40">Loading...</div>;
    }

    return (
    <div>
      <div>
        {contestData?.registrations?.length > 0 
          ? <RegistrationsTable registrations={contestData.registrations} perPage={25}/>
        : <div className="flex justify-center items-center h-40">No data avialable</div>}
      </div>
    </div>
  )
}

export default ContestRegistrations
