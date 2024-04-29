/* eslint-disable jsx-a11y/alt-text */
import { Text, View, StyleSheet, Image } from '@react-pdf/renderer';
import { ObjectId } from 'mongoose';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginTop: 10,
    marginBottom: 16,
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  leftSide: {
    width: '50%',
    marginRight: 10
  },
  rightSide: {
    width: '50%',
    flexDirection: 'column'
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 40
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5
  },
  designation: {
    fontSize: 14,
    marginBottom: 5
  },
  contactInfo: {
    fontSize: 12,
    marginBottom: 5
  }
});

interface IHeadingProps {
  name: string | ObjectId;
  designation: string;
  email: string | ObjectId;
  phone?: string;
  address: string | undefined;
  imageSrc: string | ObjectId;
}
const Heading = ({
  name,
  designation,
  email,
  phone,
  address,
  imageSrc
}: IHeadingProps) => {
  return (
    <View style={styles.container}>
      <View style={styles.leftSide}>
        <Image style={styles.image} src={imageSrc as string} />
      </View>
      <View style={styles.rightSide}>
        <Text style={styles.name}>{name as string}</Text>
        <Text style={styles.designation}>{designation}</Text>
        <Text style={styles.contactInfo}>{`Mail: ${email}`}</Text>
        {phone && <Text style={styles.contactInfo}>{`Phone: ${phone}`}</Text>}
        <Text style={styles.contactInfo}>{`Address: ${address}`}</Text>
      </View>
    </View>
  );
};
export default Heading;
