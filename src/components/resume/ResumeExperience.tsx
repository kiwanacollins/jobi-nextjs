import { IExperience } from '@/database/resume.model';
import { Text, View, StyleSheet } from '@react-pdf/renderer';

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
  experienceItem: {
    fontSize: 12,
    marginBottom: 5
  },
  company: {
    marginBottom: 5
  },
  titleYears: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5
  },
  title: {
    fontWeight: 'bold',
    fontSize: 14
  }
});

interface IExperienceProps {
  experience: IExperience[];
}

const ResumeExperience = ({ experience }: IExperienceProps) => {
  return (
    <View style={styles.section}>
      <Text style={styles.header}>Experience</Text>
      {experience?.map((item: IExperience, index) => (
        <View key={index} style={styles.experienceItem}>
          <View style={styles.titleYears}>
            <Text style={styles.title}>{item.title}</Text>
            <Text>
              {item.yearStart} - {item.yearEnd}
            </Text>
          </View>

          <Text style={styles.company}>{item.company}</Text>

          <Text>{item.description}</Text>
          {index < experience?.length - 1 && (
            <View style={{ marginBottom: 10 }} />
          )}
        </View>
      ))}
    </View>
  );
};
export default ResumeExperience;
