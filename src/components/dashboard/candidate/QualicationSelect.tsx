import NiceSelect from '@/ui/nice-select';
import { UseFormSetValue } from 'react-hook-form';

const QualicationSelect = ({
  setValue
}: {
  setValue: UseFormSetValue<any>;
}) => {
  const handleCity = (item: { value: string; label: string }) => {
    const { value } = item;
    setValue('qualification', value);
  };
  return (
    <NiceSelect
      options={[
        { value: `master's degree`, label: `Master's Degree` },
        { value: `bachelor degree`, label: `Bachelor Degree` }
      ]}
      defaultCurrent={0}
      onChange={(item) => handleCity(item)}
      name="qualification"
    />
  );
};
export default QualicationSelect;
