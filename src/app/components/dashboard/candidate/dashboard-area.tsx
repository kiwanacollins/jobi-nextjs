'use client';
import React from 'react';
import Image, { StaticImageData } from 'next/image';
import job_data from '@/data/job-data';
import icon_1 from '@/assets/dashboard/images/icon/icon_12.svg';
import icon_2 from '@/assets/dashboard/images/icon/icon_13.svg';
import icon_3 from '@/assets/dashboard/images/icon/icon_14.svg';
import icon_4 from '@/assets/dashboard/images/icon/icon_15.svg';
// import main_graph from '@/assets/dashboard/images/main-graph.png';

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

// card item
export function CardItem({
  img,
  value,
  title
}: {
  img: StaticImageData;
  value: string;
  title: string;
}) {
  return (
    <div className="col-lg-6 col-6">
      <div className="dash-card-one bg-white border-30 position-relative mb-15">
        <div className="d-sm-flex align-items-center justify-content-between">
          <div className="icon rounded-circle d-flex align-items-center justify-content-center order-sm-1">
            <Image src={img} alt="icon" className="lazy-img" />
          </div>
          <div className="order-sm-0">
            <div className="value fw-500">{value}</div>
            <span>{title}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

const DashboardArea = () => {
  const job_items = [...job_data.reverse().slice(0, 5)];
  const monthlyData = [
    { month: 'January', value: 100 },
    { month: 'February', value: 150 },
    { month: 'March', value: 200 },
    { month: 'April', value: 180 },
    { month: 'May', value: 220 },
    { month: 'June', value: 250 },
    { month: 'July', value: 300 },
    { month: 'August', value: 280 },
    { month: 'September', value: 270 },
    { month: 'October', value: 230 },
    { month: 'November', value: 190 },
    { month: 'December', value: 210 }
  ];

  const months = monthlyData.map((item) => item.month);
  const values = monthlyData.map((item) => item.value);
  const chartData = {
    labels: months,
    datasets: [
      {
        label: 'Monthly Report',
        data: values,
        Bar: true,
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgb(75, 192, 192)',
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
        <CardItem img={icon_1} title="Total Visitor" value="1.7k+" />
        <CardItem img={icon_2} title="Shortlisted" value="03" />
        <CardItem img={icon_3} title="Views" value="2.1k" />
        <CardItem img={icon_4} title="Applied Job" value="07" />
      </div>

      <div className="row d-flex pt-50 lg-pt-10">
        <div className="col-xl-7 col-lg-6 d-flex flex-column">
          <div className="user-activity-chart bg-white border-20 mt-30 h-100">
            <h4 className="dash-title-two">Profile Views</h4>
            <div className="ps-5 pe-5 mt-50">
              {/* <Image
                src={main_graph}
                alt="main-graph"
                className="lazy-img m-auto"
              /> */}
              <Bar data={chartData} options={chartOptions} />
              <Line data={chartData} options={chartOptions} />
            </div>
          </div>
        </div>
        <div className="col-xl-5 col-lg-6 d-flex">
          <div className="recent-job-tab bg-white border-20 mt-30 w-100">
            <h4 className="dash-title-two">Recent Applied Job</h4>
            <div className="wrapper">
              {job_items.map((j) => (
                <div
                  key={j.id}
                  className="job-item-list d-flex align-items-center"
                >
                  <div>
                    <Image
                      src={j.logo}
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
                      <span>Fulltime</span> . <span>{j.location}</span>
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
                        <a className="dropdown-item" href="#">
                          View Job
                        </a>
                      </li>
                      <li>
                        <a className="dropdown-item" href="#">
                          Archive
                        </a>
                      </li>
                      <li>
                        <a className="dropdown-item" href="#">
                          Delete
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DashboardArea;
