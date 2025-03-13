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
          img={icon_2}
          title="Total Applied Jobs"
          value={statistics?.totalJobApplied}
        />
      </div>
    </>
  );
};
export default CandidateDashboardArea;
