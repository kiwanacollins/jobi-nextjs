'use client';
import { moduleNameSchema } from '@/utils/validation';
import { zodResolver } from '@hookform/resolvers/zod';
import React, { useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import ErrorMsg from '../common/error-msg';
import { notifyError, notifySuccess } from '@/utils/toast';
import { z } from 'zod';
import { addModuleToCourse } from '@/lib/actions/Course.action';

interface IModuleNameProps {
  courseId: string;
  type?: string;
  pathname: string;
}

const ModuleNameForm = ({ courseId, type, pathname }: IModuleNameProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  type moduleNameType = z.infer<typeof moduleNameSchema>;
  const moduleNameMethods = useForm<moduleNameType>({
    resolver: zodResolver(moduleNameSchema),
    defaultValues: {
      moduleName: ''
    }
  });

  const {
    register,
    reset,
    handleSubmit,
    formState: { errors }
  } = moduleNameMethods;

  const onSubmit = async (data: moduleNameType) => {
    setIsSubmitting(true);
    try {
      if (type === 'add') {
        const res = await addModuleToCourse({
          courseId,
          moduleName: data.moduleName,
          path: pathname
        });
        if (res.success) {
          notifySuccess(res.message);
        }
        if (res.error) {
          notifyError(res.message);
        }
      }
    } catch (error: any) {
      console.log('error', error);
      notifyError(error.message);
    } finally {
      setIsSubmitting(false);
      reset();
    }
  };

  return (
    <FormProvider {...moduleNameMethods}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="bg-white card-box border-20 mt-40">
          <h4 className="dash-title-three">
            {type === 'add' ? 'Create Module' : 'Update Module'}
          </h4>
          <div className="dash-input-wrapper mb-30 md-mb-10">
            <label htmlFor="">Module Name*</label>
            <input
              type="text"
              placeholder="Enter Module Name"
              {...register(`moduleName`)}
              name="moduleName"
            />
            {errors?.moduleName && (
              <ErrorMsg msg={errors?.moduleName?.message} />
            )}
          </div>
          <div className="button-group d-inline-flex align-items-center ">
            <button
              disabled={isSubmitting}
              type="submit"
              className="dash-btn-two tran3s me-3 px-4"
            >
              {isSubmitting ? (
                <>{type === 'edit' ? 'Updating...' : 'Creating...'}</>
              ) : (
                <>{type === 'add' ? 'Create Module' : 'Update Module'}</>
              )}
            </button>
          </div>
        </div>
      </form>
    </FormProvider>
  );
};

export default ModuleNameForm;
