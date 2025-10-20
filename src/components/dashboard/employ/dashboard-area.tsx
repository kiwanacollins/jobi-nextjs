'use client';
import React from 'react';
import Image from 'next/image';
// import icon_1 from '@/assets/dashboard/images/icon/icon_12.svg';
import icon_2 from '@/assets/dashboard/images/icon/icon_13.svg';
// import icon_3 from '@/assets/dashboard/images/icon/icon_14.svg';
import icon_4 from '@/assets/dashboard/images/icon/icon_15.svg';
// import main_graph from '@/assets/dashboard/images/main-graph.png';
import { CardItem } from '../candidate/dashboard-area';
// import NiceSelect from '@/ui/nice-select';
import { IJobData } from '@/database/job.model';
import { usePathname } from 'next/navigation';
import Swal from 'sweetalert2';
import { deleteEmployeeJobPost } from '@/lib/actions/employee.action';

import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  Tooltip,
  Legend,
  LinearScale,
  PointElement,
  LineElement
} from 'chart.js';
import { Bar, Line } from 'react-chartjs-2';

ChartJS.register(
  BarElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend
);

// props type

interface IEmployDashboardProps {
  jobs: IJobData[];
  totalJob: number;
  statistics: any;
}

const EmployDashboardArea = ({
  jobs,
  totalJob,
  statistics
}: IEmployDashboardProps) => {
  const pathname = usePathname();

  const handleDeleteUser = async (jobId: string | undefined) => {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then(async (result) => {
      if (result.isConfirmed) {
        //Todo: delete job post by Id
        const res = await deleteEmployeeJobPost({
          jobId,
          path: pathname
        });
        if (res.status === 'ok') {
          Swal.fire({
            title: 'Deleted!',
            text: res.message,
            icon: 'success'
          });
        }
      }
    });
  };
  // const handleJobs = (item: { value: string; label: string }) => {};

  const category = statistics?.totalJobsByCategory?.map(
    (item: any) => item._id
  );
  const categoryValues = statistics?.totalJobsByCategory?.map(
    (item: any) => item.totalJobs
  );

  const barChartDataCategory = {
    labels: category,
    datasets: [
      {
        label: 'Category Report',
        PointElement: true,
        data: categoryValues,
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgb(75, 192, 192)',
        borderWidth: 1
      }
    ]
  };

  const skills = statistics?.totalJobsBySkills?.map((item: any) => item._id);
  const skillValues = statistics?.totalJobsBySkills?.map(
    (item: any) => item.totalJobs
  );

  const barChartDataSkills = {
    labels: skills,
    datasets: [
      {
        label: 'Category Report',
        PointElement: true,
        data: skillValues,
        backgroundColor: 'tomato',
        borderColor: 'tomato',
        borderWidth: 1
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true
      }
    }
  };
  return (
    <>
      <h2 className="main-title">Dashboard</h2>
      <div className="row">
        {/* <CardItem icon={<img src={icon_1.src} alt="Total Visitor" style={{width:32,height:32}} />} title="Total Visitor" value="1.7k+" /> */}
        <CardItem
          icon={<img src={icon_2.src} alt="Shortlisted" style={{width:32,height:32}} />}
          title="Shortlisted"
          value={statistics?.totalSavedUsers}
        />
        {/* <CardItem icon={<img src={icon_3.src} alt="Views" style={{width:32,height:32}} />} title="Views" value="2.1k" /> */}
        <CardItem
          icon={<img src={icon_4.src} alt="Posted Job" style={{width:32,height:32}} />}
          title="Posted Job"
          value={statistics?.totalPostedJobs}
        />
      </div>

      <div className="row d-flex pt-50 lg-pt-10">
        <div className="col-xl-7 col-lg-6 d-flex flex-column">
          <div className="user-activity-chart bg-white border-20 mt-30 h-100">
            <h4 className="dash-title-two">Statistics Views</h4>
            {/* <div className="d-sm-flex align-items-center job-list">
              <div className="fw-500 pe-3">Jobs:</div>
              <div className="flex-fill xs-mt-10">
                <NiceSelect
                  options={[
                    {
                      value: 'Web-&-Mobile-Prototype-designer',
                      label: 'Web & Mobile Prototype designer....'
                    },
                    { value: 'Document Writer', label: 'Document Writer' },
                    {
                      value: 'Outbound Call Service',
                      label: 'Outbound Call Service'
                    },
                    { value: 'Product Designer', label: 'Product Designer' }
                  ]}
                  defaultCurrent={0}
                  onChange={(item) => handleJobs(item)}
                  name="Search Jobs"
                />
              </div>
            </div> */}
            <div className="ps-5 pe-5 mt-50">
              {/* <Image
                src={main_graph}
                alt="main-graph"
                className="lazy-img m-auto"
              /> */}
              <div>
                <Bar data={barChartDataCategory} options={chartOptions} />
                <p className="text-center fw-semibold  py-3">
                  Bar Chart (category)
                </p>
              </div>
              <div>
                <Bar data={barChartDataSkills} options={chartOptions} />
                <p className="text-center fw-semibold  py-3">
                  Bar Chart (Skills)
                </p>
              </div>
              <div>
                <Line data={barChartDataSkills} options={chartOptions} />
                <p className="text-center fw-semibold  py-3">
                  Line Chart (Skills)
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="col-xl-5 col-lg-6 d-flex">
          <div className="recent-job-tab bg-white border-20 mt-30 w-100">
            <h4 className="dash-title-two">Posted Job - {totalJob}</h4>
            <div className="wrapper">
              {jobs?.map((j) => (
                <div
                  key={j._id}
                  className="job-item-list d-flex align-items-center"
                >
                  <div>
                    <Image
                      src={
                        //@ts-ignore
                        (j?.createdBy?.picture as string) ||
                        '/assets/images/logo/media_22.png'
                      }
                      alt="logo"
                      width={40}
                      height={40}
                      className="lazy-img logo"
                    />
                  </div>
                  <div className="job-title">
                    <h6 className="mb-5">
                      <a href="#">{j.duration}</a>
                    </h6>
                    <div className="meta">
                      <span>{j.duration}</span> . <span>{j.city}</span>
                    </div>
                  </div>
                  <div className="job-action">
                    <button
                      className="action-btn dropdown-toggle"
                      type="button"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                    >
                      <span></span>
                    </button>
                    <ul className="dropdown-menu">
                      <li>
                        <button className="dropdown-item">View Job</button>
                      </li>
                      <li>
                        <button className="dropdown-item">Archive</button>
                      </li>
                      <li>
                        <button
                          onClick={() => handleDeleteUser(j._id)}
                          className="dropdown-item"
                        >
                          Delete
                        </button>
                      </li>
                    </ul>
                  </div>
                </div>
              ))}
              {totalJob === 0 && (
                <div className="job-item-list w-100  justify-content-center  d-flex align-items-center">
                  <div className="job-title">
                    <h4 className="mb-5">No Job Post</h4>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default EmployDashboardArea;
