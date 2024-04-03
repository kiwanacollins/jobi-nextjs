import React from 'react';
// import candidate_data from '@/data/candidate-data';
import EmployShortSelect from '@/app/components/dashboard/employ/short-select';
import CandidateItem from '@/app/components/dashboard/employ/candidate-item';
import { getAllCandidates } from '@/lib/actions/candidate.action';
import { IUser } from '@/database/user.model';
import CommonPagination from '@/app/components/common/CommonPagination';
import { SearchParamsProps } from '@/types';

const UsersPage = async ({ searchParams }: SearchParamsProps) => {
  // const candidate_items = candidate_data.slice(0, 4);
  const { candidates, isNext, totalCandidates } = await getAllCandidates({
    query: searchParams.query,
    page: searchParams.page ? +searchParams.page : 1,
    sort: searchParams.sort
  });

  return (
    <div className="position-relative">
      <div className="d-flex align-items-center justify-content-between mb-40 lg-mb-30">
        <h2 className="main-title m0">
          All Candidates
          <span>{totalCandidates > 0 ? ` (${totalCandidates})` : ''}</span>
        </h2>
        <div className="short-filter d-flex align-items-center">
          <div className="text-dark fw-500 me-2">Short by:</div>
          <EmployShortSelect />
        </div>
      </div>

      <div className="wrapper">
        {candidates?.map((item: IUser) => (
          <CandidateItem key={item._id} item={item} />
        ))}
      </div>

      <div className=" d-flex justify-content-end mt-30">
        <CommonPagination
          isNext={isNext}
          pageNumber={searchParams.page ? +searchParams.page : 1}
        />
      </div>
    </div>
  );
};

export default UsersPage;
