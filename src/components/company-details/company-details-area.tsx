import React from 'react';
import Image from 'next/image';
import logo from '@/assets/images/logo/media_37.png';
import SavedCandidateListArea from '../dashboard/admin/candidates/SavedCandidateListArea';
import Link from 'next/link';
import { IUser } from '@/database/user.model';

interface IProps {
  company: any;
  candidates: IUser[];
}

const CompanyDetailsArea = ({ company, candidates }: IProps) => {
  return (
    <>
      <section className="company-details pt-110 lg-pt-80 pb-160 xl-pb-150 lg-pb-80">
        <div className="container">
          <div className="row">
            <div className="col-xxl-3 col-xl-4 order-xl-last">
              <div className="job-company-info ms-xl-5 ms-xxl-0 lg-mb-50">
                <Image
                  src={company?.picture || logo}
                  alt="logo"
                  width={80}
                  height={80}
                  className="lazy-img rounded-circle m-auto logo"
                />
                <div className="text-md text-dark text-center mt-15 mb-20 lg-mb-10">
                  <p className="fw-bold">{company?.companyName}</p>
                </div>
                <div className="text-center">
                  <Link
                    href={company?.website || ''}
                    className="website-btn-two tran3s"
                    target="_blank"
                  >
                    Visit our website
                  </Link>
                </div>

                <div className="border-top mt-35 lg-mt-20 pt-25">
                  <ul className="job-meta-data row style-none">
                    <li className="col-12">
                      <span>Location: </span>
                      <div>Spain, Barcelona </div>
                    </li>

                    <li className="col-12">
                      <span>Email: </span>
                      <div>
                        <a>{company?.email}</a>
                      </div>
                    </li>

                    <li className="col-12">
                      <span>Category: </span>
                      <div>{company?.categories.join(', ')}</div>
                    </li>
                    <li className="col-12">
                      <span>Social: </span>
                      <div>
                        <a href="#" className="me-3">
                          <i className="bi bi-facebook"></i>
                        </a>
                        <a href="#" className="me-3">
                          <i className="bi bi-instagram"></i>
                        </a>
                        <a href="#" className="me-3">
                          <i className="bi bi-twitter"></i>
                        </a>
                        <a href="#">
                          <i className="bi bi-linkedin"></i>
                        </a>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            {/* overview */}
            <div className="col-xxl-9 col-xl-8 order-xl-first">
              <div className="details-post-data me-xxl-5 pe-xxl-4">
                <SavedCandidateListArea candidates={candidates} />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default CompanyDetailsArea;
