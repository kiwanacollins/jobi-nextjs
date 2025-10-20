'use client';
import React from 'react';
import { MessageCircle, FileText, Users, Briefcase } from 'lucide-react';
// import main_graph from '@/assets/dashboard/images/main-graph.png';

import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  Tooltip,
  Legend,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement
} from 'chart.js';
import { Bar, Line, Pie } from 'react-chartjs-2';
import { IUser } from '@/database/user.model';

ChartJS.register(
  BarElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  ArcElement
);

// card item
export function CardItem({
  icon,
  value,
  title
}: {
  icon: React.ReactNode;
  value: string;
  title: string;
}) {
  return (
    <div className="col-lg-6 col-6">
      <div className="dash-card-one bg-white border-30 position-relative mb-15">
        <div className="d-sm-flex align-items-center justify-content-between">
          <div className="icon rounded-circle d-flex align-items-center justify-content-center order-sm-1">
            {icon}
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

interface IDashboardAreaProps {
  statistics: any;
  candidates?: IUser[];
}

const DashboardArea = ({ statistics, candidates }: IDashboardAreaProps) => {
  const dates = statistics?.usersByJoinedAt?.map((item: any) => item._id);
  const values = statistics?.usersByJoinedAt?.map((item: any) => item.count);
  const chartData = {
    labels: dates,
    datasets: [
      {
        label: 'Daily Report',
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
  const piChartData = {
    labels: ['candidates', 'Hired'],
    datasets: [
      {
        data: [statistics.totalCandidates, statistics.totalHiredUsers],
        backgroundColor: ['#059BFF', '#FF6384'],
        hoverBackgroundColor: ['#059BFF', '#FF6384']
      }
    ]
  };

  const piChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: 'top'
        },
        title: {
          display: true,
          text: 'Chart.js Pie Chart'
        }
      }
    }
  };

  return (
    <>
      <h2 className="main-title">Dashboard</h2>
      <div className="row">
        <CardItem
          icon={<Users size={24} style={{ color: '#000000' }} />}
          title="Total Users"
          value={statistics?.totalUsers}
        />
        <CardItem
          icon={<MessageCircle size={24} style={{ color: '#000000' }} />}
          title="Messages"
          value={statistics?.totalMessages}
        />
        <CardItem
          icon={<FileText size={24} style={{ color: '#000000' }} />}
          title="Blogs"
          value={statistics?.totalBlogs}
        />
        <CardItem
          icon={<Briefcase size={24} style={{ color: '#000000' }} />}
          title="Total Jobs"
          value={statistics?.totalJobPosts}
        />
      </div>

      <div className="row d-flex pt-50 lg-pt-10">
        <div className="col-xl-7 col-lg-6 d-flex flex-column">
          <div className="user-activity-chart bg-white border-20 mt-30 h-100">
            <h4 className="dash-title-two">User Statistics</h4>
            <div className="ps-5 pe-5 mt-50">
              {/* <Image
                src={main_graph}
                alt="main-graph"
                className="lazy-img m-auto"
              /> */}
              <div>
                <Bar data={chartData} options={chartOptions} />
                <p className="text-center fw-bold py-3">
                  Bar Chart (Daily Join User)
                </p>
              </div>
              <div>
                <Line data={chartData} options={chartOptions} />
                <p className="text-center fw-bold py-3">
                  Line Chart (Daily Join User)
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="col-xl-5 col-lg-6 ">
          <Pie options={piChartOptions} data={piChartData} />

          {/* <div className="recent-job-tab bg-white border-20 mt-30 w-100">
            <h4 className="dash-title-two">Recent Candidates</h4>
            <div className="wrapper">
              {candidates
                ?.slice(0, 5)
                .map((item: IUser) => (
                  <CandidateItem key={item._id} item={item} />
                ))}
            </div>
          </div> */}
        </div>
      </div>
    </>
  );
};

export default DashboardArea;
