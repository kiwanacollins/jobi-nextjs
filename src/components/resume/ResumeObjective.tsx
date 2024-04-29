import { StyleSheet, Text, View } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  section: {
    marginTop: 10,
    flexGrow: 1
  },
  content: {
    fontSize: 12,
    marginBottom: 5
  },
  header: {
    fontSize: 16,
    marginBottom: 10,
    fontWeight: 'bold'
  }
});

const ResumeObjective = ({ overview }: { overview: string }) => {
  return (
    <View style={styles.section}>
      <Text style={styles.header}>Summary</Text>
      <Text style={styles.content}>{overview}</Text>
    </View>
  );
};
export default ResumeObjective;
