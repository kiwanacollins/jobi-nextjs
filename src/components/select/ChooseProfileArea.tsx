'use client';
import { notifyError } from '@/utils/toast';
import { Briefcase, UserRound } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

interface IProps {
  handleSelectAccount: (profile: string) => void;
  selectAccount: string;
}

function EmployeeCard({ handleSelectAccount, selectAccount }: IProps) {
  return (
    <div
      onClick={() => handleSelectAccount('employee')}
      className={`col-md-4 cursor-pointer  col-sm-12 d-flex flex-column justify-content-center align-items-center py-3 px-4 rounded shadow bg-light ${selectAccount === 'employee' ? 'border border-2 border-success' : ''}`}
    >
      {/*  */}
      <Briefcase
        className={`mb-3 ${selectAccount === 'employee' ? ' text-success' : ''}`}
        size={48}
      />
      <h3 className={`${selectAccount === 'employee' ? ' text-success' : ''}`}>
        I&apos;m a Employee
      </h3>
      <p>Looking for talented candidates</p>
    </div>
  );
}

function JobSeekerCard({ handleSelectAccount, selectAccount }: IProps) {
  return (
    <div
      onClick={() => handleSelectAccount('candidate')}
      className={`col-md-4 cursor-pointer col-sm-12 d-flex flex-column justify-content-center align-items-center py-3 px-4 rounded shadow bg-light ${selectAccount === 'candidate' ? 'border border-2 border-success ' : ''}`}
    >
      <UserRound
        className={`mb-3 ${selectAccount === 'candidate' ? ' text-success' : ''}`}
        size={48}
      />
      <h3 className={`${selectAccount === 'candidate' ? ' text-success' : ''}`}>
        I&apos;m a Jobseeker
      </h3>
      <p>Looking for job</p>
    </div>
  );
}

const ChooseProfileArea = () => {
  const [selectAccount, setSelectAccount] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSelectAccount = (profile: string) => {
    setSelectAccount(profile);
  };
  const router = useRouter();

  const handleProfileNavigation = (role: string) => {
    try {
      setLoading(true);
      if (role === 'employee') {
        router.push('/createProfile');
      }
      if (role === 'candidate') {
        router.push('/new-candidateProfile');
      }
      router.push('/');
    } catch (error) {
      console.log(error);
      notifyError('Something went wrong');
    } finally {
      //   setLoading(false);
    }
  };

  return (
    <div className="container py-5">
      <div className="row d-flex justify-content-center gap-4 ">
        <EmployeeCard
          handleSelectAccount={handleSelectAccount}
          selectAccount={selectAccount}
        />
        <JobSeekerCard
          handleSelectAccount={handleSelectAccount}
          selectAccount={selectAccount}
        />
      </div>
      <div className="d-flex flex-column align-items-center   justify-content-center py-3 gap-3 ">
        <div>
          <button
            onClick={() => handleProfileNavigation(selectAccount)}
            type="button"
            disabled={selectAccount === '' || loading}
            className={`btn ${selectAccount === '' ? 'btn-secondary' : 'btn-success '} px-5 rounded-pill`}
          >
            {loading
              ? 'Loading...'
              : selectAccount === ''
                ? 'Create Account'
                : selectAccount === 'employee'
                  ? 'Continue as Employee'
                  : 'Continue as Jobseeker'}
          </button>
        </div>
        <div className="text-center">
          <p>
            Already have an account?{' '}
            <Link href={'/sign-in'}>
              <span className="text-success fw-bold ">Log in</span>
            </Link>{' '}
          </p>
        </div>
      </div>
    </div>
  );
};
export default ChooseProfileArea;
