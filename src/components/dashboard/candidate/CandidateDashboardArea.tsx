import { CardItem } from './dashboard-area';
import icon_2 from '@/assets/dashboard/images/icon/icon_13.svg';

interface IDashboardAreaProps {
  statistics: any;
}
const CandidateDashboardArea = ({ statistics }: IDashboardAreaProps) => {
  return (
    <>
      <h2 className="main-title">Dashboard</h2>
      <div className="row">
        <CardItem
          icon={<img src={icon_2.src} alt="Applied Jobs" style={{width:32,height:32}} />}
          title="Total Applied Jobs"
          value={statistics?.totalJobApplied}
        />
      </div>
    </>
  );
};
export default CandidateDashboardArea;
