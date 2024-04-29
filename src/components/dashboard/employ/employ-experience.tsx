import React from 'react';
import { Controller, UseControllerProps } from 'react-hook-form';
import Select from 'react-select';
import ErrorMsg from '../../common/error-msg';

interface IExprienceType {
  errors: any;
  control: UseControllerProps<any>['control'];
}

const EmployExperience = ({ errors, control }: IExprienceType) => {
  return (
    <div className="row align-items-end">
      <div className="col-md-6">
        <div className=" mb-30">
          <label className="fw-semibold pb-1" htmlFor="">
            Experience*
          </label>

          <Controller
            name="experience"
            control={control}
            render={({ field }) => (
              <>
                <Select
                  {...field}
                  options={[
                    { value: 'Intermediate', label: 'Intermediate' },
                    { value: 'No-Experience', label: 'No-Experience' },
                    { value: 'Expert', label: 'Expert' }
                  ]}
                  // className="basic-multi-select"
                  classNamePrefix="select"
                  onChange={(selectedOption) =>
                    field.onChange(selectedOption?.value)
                  }
                  value={
                    field.value
                      ? { value: field.value, label: field.value }
                      : null
                  }
                />
                {errors?.experience && (
                  <ErrorMsg msg={errors?.experience?.message} />
                )}
              </>
            )}
          />
        </div>
      </div>
      <div className="col-md-6">
        <div className=" mb-30">
          <label className="fw-semibold pb-1" htmlFor="">
            Location*
          </label>
          <Controller
            name="location"
            control={control}
            render={({ field }) => (
              <>
                <Select
                  {...field}
                  options={[
                    { value: 'Washington DC', label: 'Washington DC' },
                    { value: 'California, CA', label: 'California, CA' },
                    { value: 'New York', label: 'New York' },
                    { value: 'Miami', label: 'Miami' }
                  ]}
                  className="basic-multi-select"
                  classNamePrefix="select"
                  onChange={(selectedOption) =>
                    field.onChange(selectedOption?.value)
                  }
                  value={
                    field.value
                      ? { value: field.value, label: field.value }
                      : null
                  }
                />
                {errors?.location && (
                  <ErrorMsg msg={errors?.location?.message} />
                )}
              </>
            )}
          />
        </div>
      </div>
      <div className="col-md-6">
        <div className=" mb-30">
          <label className="fw-semibold pb-1" htmlFor="">
            Industry*
          </label>
          <Controller
            name="industry"
            control={control}
            render={({ field }) => (
              <>
                <Select
                  {...field}
                  options={[
                    { value: 'Select Industry', label: 'Select Industry' },
                    { value: 'Select Industry 2', label: 'Select Industry 2' }
                  ]}
                  className="basic-multi-select"
                  classNamePrefix="select"
                  onChange={(selectedOption) =>
                    field.onChange(selectedOption?.value)
                  }
                  value={
                    field.value
                      ? { value: field.value, label: field.value }
                      : null
                  }
                />
                {errors?.industry && (
                  <ErrorMsg msg={errors?.industry?.message} />
                )}
              </>
            )}
          />
        </div>
      </div>
      <div className="col-md-6">
        <div className=" mb-30">
          <label className="fw-semibold pb-1" htmlFor="">
            English Fluency
          </label>
          <Controller
            name="english_fluency"
            control={control}
            render={({ field }) => (
              <>
                <Select
                  {...field}
                  options={[
                    { value: 'Basic', label: 'Basic' },
                    { value: 'Conversational', label: 'Conversational' },
                    { value: 'Fluent', label: 'Fluent' },
                    { value: 'Native/Bilingual', label: 'Native/Bilingual' }
                  ]}
                  className="basic-multi-select"
                  classNamePrefix="select"
                  onChange={(selectedOption) =>
                    field.onChange(selectedOption?.value)
                  }
                  value={
                    field.value
                      ? { value: field.value, label: field.value }
                      : null
                  }
                />
                {errors.english_fluency && (
                  <ErrorMsg msg={errors?.english_fluency?.message} />
                )}
              </>
            )}
          />
        </div>
      </div>
    </div>
  );
};

export default EmployExperience;
