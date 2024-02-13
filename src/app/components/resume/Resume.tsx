//@ts-nocheck
import { Page, Document, StyleSheet, View } from '@react-pdf/renderer';
import Heading from './Heading';
import Education from './Education';
import ResumeObjective from './ResumeObjective';
import ResumeSkills from './ResumeSkills';
import ResumeExperience from './ResumeExperience';

import { IEducation, IExperience } from '@/database/resume.model';
import { ObjectId } from 'mongoose';

const styles = StyleSheet.create({
  page: {
    paddingTop: 48,
    paddingHorizontal: 50,
    width: '100%',
    height: '100%'
  },
  row: {
    flexDirection: 'row'
  },
  leftColumn: {
    flexGrow: 1,
    marginRight: 16,
    width: '40%'
  },
  rightColumn: {
    flexGrow: 1,
    width: '60%'
  },
  content: {
    fontSize: 12,
    marginBottom: 5
  },
  summary: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 5
  }
});

interface IResumeProps {
  overview: string;
  user: string | ObjectId;
  education: IEducation[];
  experience: IExperience[];
  skills: string[];
}

const Resume = ({
  overview,
  user,
  education,
  experience,
  skills
}: IResumeProps) => {
  return (
    <Document
      title="Rakib Hasan Resume"
      author="Rakib Hasan"
      subject="Resume"
      keywords="resume,job"
    >
      <Page size="A4" style={styles.page}>
        <Heading
          name={user?.name as string}
          designation="Software Developer"
          email={user?.email as string}
          phone={'01700000000'}
          address={user?.address as string}
          imageSrc={user?.picture as string}
        />
        {/* Mail content 2 section left right start */}

        <View style={styles.row}>
          <View style={styles.leftColumn}>
            <Education education={education} />
          </View>
          <View style={styles.rightColumn}>
            <ResumeObjective overview={overview} />
            <ResumeSkills skills={skills} />
            <ResumeExperience experience={experience} />
          </View>
        </View>
        {/* Mail content 2 section left right end */}
      </Page>
    </Document>
  );
};
export default Resume;
