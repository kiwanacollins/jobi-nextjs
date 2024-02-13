import { IEducation } from '@/database/resume.model';
import { StyleSheet, View, Text } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  section: {
    marginTop: 10,
    flexGrow: 1
  },
  header: {
    fontSize: 16,
    marginBottom: 10,
    fontWeight: 'bold'
  },
  content: {
    fontSize: 12,
    marginBottom: 5
  },
  title: {
    fontWeight: 'bold',
    fontSize: 14
  },
  academy: {
    fontSize: 12,
    marginTop: 10
  }
});

interface IEducationProps {
  education: IEducation[];
}

const Education = ({ education }: IEducationProps) => {
  return (
    <View style={styles.section}>
      <Text style={styles.header}>Education</Text>
      {education?.map((education: IEducation, index) => (
        <View key={index}>
          <Text style={styles.title}>{education.title}</Text>
          <Text style={styles.academy}>{education.academy}</Text>
          <Text style={styles.content}>
            {education.yearStart} - {education.yearEnd}
          </Text>
          {index < education.length - 1 && (
            <View style={{ marginBottom: 10 }} />
          )}
        </View>
      ))}
    </View>
  );
};
export default Education;
