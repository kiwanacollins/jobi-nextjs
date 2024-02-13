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
  skillItem: {
    fontSize: 12,
    padding: '5px 10px'
  },
  skills: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: '10px'
  }
});
const skillsData = ['JavaScript', 'React', 'Node.js', 'HTML', 'CSS', 'Git'];
const ResumeSkills = () => {
  return (
    <View style={styles.section}>
      <Text style={styles.header}>Skills</Text>
      <Text style={styles.skills}>
        <Text style={styles.skillItem}>{skillsData.join(', ')}</Text>
      </Text>
    </View>
  );
};
export default ResumeSkills;
