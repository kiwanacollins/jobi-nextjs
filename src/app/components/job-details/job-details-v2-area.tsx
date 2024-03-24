import React from 'react';
import Image from 'next/image';
import icon_1 from '@/assets/images/icon/icon_52.svg';
import icon_2 from '@/assets/images/icon/icon_53.svg';
import icon_3 from '@/assets/images/icon/icon_54.svg';
import icon_4 from '@/assets/images/icon/icon_55.svg';
import icon_5 from '@/assets/images/icon/icon_56.svg';
import { IJobData } from '@/database/job.model';
import ParseHTML from '../common/parseHTML';

interface IJobDetailsV2AreaProps {
  job: IJobData;
}

const JobDetailsV2Area = ({ job }: IJobDetailsV2AreaProps) => {
  return (
    <section className="job-details style-two pt-100 lg-pt-80 pb-130 lg-pb-80">
      <div className="container">
        <div className="row">
          <div className="col-xxl-9 col-xl-10 m-auto">
            <div className="details-post-data ps-xxl-4 pe-xxl-4">
              <ul className="job-meta-data-two d-flex flex-wrap justify-content-center justify-content-lg-between style-none">
                <div className="bg-wrapper bg-white text-center">
                  <Image
                    src={icon_1}
                    alt="icon"
                    className="lazy-img m-auto icon"
                  />
                  <span>Salary</span>
                  <div>
                    ${job?.minSalary}k-${job?.maxSalary}k/{job?.salary_duration}
                  </div>
                </div>
                <div className="bg-wrapper bg-white text-center">
                  <Image
                    src={icon_2}
                    alt="icon"
                    className="lazy-img m-auto icon"
                  />
                  <span>Expertise</span>
                  <div>{job?.experience}</div>
                </div>
                <div className="bg-wrapper bg-white text-center">
                  <Image
                    src={icon_3}
                    alt="icon"
                    className="lazy-img m-auto icon"
                  />
                  <span>Location</span>
                  <div>{job?.location}</div>
                </div>
                <div className="bg-wrapper bg-white text-center">
                  <Image
                    src={icon_4}
                    alt="icon"
                    className="lazy-img m-auto icon"
                  />
                  <span>Job Type</span>
                  <div>{job?.duration}</div>
                </div>
                <div className="bg-wrapper bg-white text-center">
                  <Image
                    src={icon_5}
                    alt="icon"
                    className="lazy-img m-auto icon"
                  />
                  <span>Experience</span>
                  <div>{job?.experience}</div>
                </div>
              </ul>

              <div className="post-block mt-60 lg-mt-40">
                <h4 className="block-title">Job Description</h4>
                <ParseHTML data={job?.overview} />
              </div>
              {/* <div className="post-block mt-70 lg-mt-40">
                <h4 className="block-title">Responsibilities</h4>
                <ul className="list-type-one style-none mb-15">
                  <li>
                    Collaborate daily with a multidisciplinary team of Software
                    Engineers, Researchers, Strategists, and Project Managers.
                  </li>
                  <li>
                    Co-lead ideation sessions, workshops, demos, and
                    presentations with clients on-site
                  </li>
                  <li>
                    Push for and create inclusive, accessible design for all
                  </li>
                  <li>
                    Maintain quality of the design process and ensure that when
                    designs are translated into code they accurately reflect the
                    design specifications.
                  </li>
                  <li>
                    Sketch, wireframe, build IA, motion design, and run
                    usability tests
                  </li>
                  <li>
                    Design pixel perfect responsive UI’s and understand that
                    adopting common interface pattern is better for UX than
                    reinventing the wheel
                  </li>
                  <li>
                    Ensure content strategy and design are perfectly in-sync
                  </li>
                  <li>
                    Give and receive design critique to help constantly refine
                    and push our work
                  </li>
                </ul>
              </div>
              <div className="post-block mt-55 lg-mt-40">
                <h4 className="block-title">Required Skills:</h4>
                <ul className="list-type-two style-none mb-15">
                  <li>You’ve been designing digital products for 2+ years.</li>
                  <li>
                    A portfolio that exemplifies strong visual design and a
                    focus on defining the user experience.
                  </li>
                  <li>You’ve proudly shipped and launched several products.</li>
                  <li>
                    You have some past experience working in an agile
                    environment – Think two-week sprints.
                  </li>
                  <li>
                    Experience effectively presenting and communicating your
                    design decisions to clients and team members
                  </li>
                  <li>
                    Up-to-date knowledge of design software like Figma, Sketch
                    etc.
                  </li>
                </ul>
              </div>
              <div className="post-block mt-55 lg-mt-40">
                <h4 className="block-title">Benefits:</h4>
                <ul className="list-type-two style-none mb-15">
                  <li>We are a remote-first company.</li>
                  <li>
                    100% company-paid health insurance premiums for you & your
                    dependents
                  </li>
                  <li>Vacation stipend</li>
                  <li>Unlimited paid vacation and paid company holidays</li>
                  <li>Monthly wellness/gym stipend</li>
                </ul>
              </div> */}
              {/* <button className="btn-ten text-decoration-none   fw-500 text-white text-center tran3s mt-30">
                Apply for this position
              </button> */}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default JobDetailsV2Area;
