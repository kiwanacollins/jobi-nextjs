'use client';

import { notifyError, notifySuccess } from '@/utils/toast';
import { moduleVideoSchema } from '@/utils/validation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { useForm, useFieldArray, FormProvider } from 'react-hook-form';
import { z } from 'zod';
import ErrorMsg from '../common/error-msg';
import { IModule } from '@/database/Module.model';
import { updateModule } from '@/lib/actions/Course.action';
import { usePathname } from 'next/navigation';

interface IUpdateModuleFormProps {
  module: IModule;
}

const UpdateModuleForm = ({ module }: IUpdateModuleFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const pathname = usePathname();

  const groupVideos = module.content.map((video) => {
    return {
      title: video.title,
      videoId: video.videoId
    };
  });

  type moduleSchemaType = z.infer<typeof moduleVideoSchema>;
  const methods = useForm<moduleSchemaType>({
    resolver: zodResolver(moduleVideoSchema),
    defaultValues: {
      moduleName: module.title || '',
      content: groupVideos ?? [
        {
          title: '',
          videoId: ''
        }
      ]
    }
  });

  const {
    register,
    reset,
    control,
    handleSubmit,
    formState: { errors }
  } = methods;

  useEffect(() => {
    reset();
  }, [reset]);

  const {
    fields: videosArrayFields,
    append: videoAppend,
    remove: removeVideo
  } = useFieldArray({
    control,
    name: 'content'
  });

  const handleAddVideos = (e: any) => {
    e.preventDefault(); // Prevent form submission
    videoAppend({
      title: '',
      videoId: ''
    });
  };

  const onSubmit = async (data: moduleSchemaType) => {
    setIsSubmitting(true);
    try {
      // Call the API to create a new course
      const res = await updateModule({
        moduleId: module._id,
        updateData: data,
        path: pathname
      });
      if (res.success) {
        notifySuccess(res.message);
      }
      if (res.error) {
        notifyError(res.message);
      }
    } catch (error: any) {
      console.log('error', error);
      notifyError(error.message as string);
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <>
      <FormProvider {...methods}>
        {/* Add videos start */}
        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Video accrodion start */}
          <div className="bg-white card-box border-20 mt-40">
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

            {/* Add Education Start */}
            {videosArrayFields.map((item, index) => {
              return (
                <div
                  key={item.id}
                  className="accordion dash-accordion-one"
                  id={`accordionThree${index}`}
                >
                  <div className="accordion-item">
                    <div className="accordion-header" id="headingThree">
                      <button
                        className="accordion-button collapsed"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target={`#collapseThree${index}`}
                        aria-expanded="false"
                        aria-controls="collapseThree"
                      >
                        Content {index + 1}*
                      </button>
                    </div>
                    <div
                      id={`collapseThree${index}`}
                      className="accordion-collapse collapse"
                      aria-labelledby="headingThree"
                      data-bs-parent={`#accordionThree${index}`}
                    >
                      <div className="accordion-body">
                        <div className="row">
                          <div className="col-lg-2">
                            <div className="dash-input-wrapper mb-30 md-mb-10">
                              <label htmlFor="">Title*</label>
                            </div>
                          </div>
                          <div className="col-lg-10">
                            <div className="dash-input-wrapper mb-30">
                              <input
                                type="text"
                                placeholder="Your Video Title"
                                {...register(`content.${index}.title`)}
                                name={`content.${index}.title`}
                              />
                              {errors?.content?.[index]?.title && (
                                <ErrorMsg
                                  msg={errors?.content?.[index]?.title?.message}
                                />
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="row">
                          <div className="col-lg-2">
                            <div className="dash-input-wrapper mb-30 md-mb-10">
                              <label htmlFor="">Video Id*</label>
                            </div>
                          </div>
                          <div className="col-lg-10">
                            <div className="dash-input-wrapper mb-30">
                              <input
                                type="text"
                                placeholder="Enter Video ID"
                                {...register(`content.${index}.videoId`)}
                                name={`content.${index}.videoId`}
                              />
                              {errors?.content?.[index]?.videoId && (
                                <ErrorMsg
                                  msg={
                                    errors?.content?.[index]?.videoId?.message
                                  }
                                />
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="row">
                          <button
                            onClick={() => removeVideo(index)}
                            className="btn btn-danger w-auto  m-2"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
            {/* Add Education End */}
            <button
              onClick={(e) => handleAddVideos(e)}
              className="dash-btn-one"
            >
              <i className="bi bi-plus"></i> Add more
            </button>
            <div className="button-group d-inline-flex align-items-center mt-30">
              <button
                disabled={isSubmitting}
                type="submit"
                className="dash-btn-two tran3s me-3 px-4"
              >
                {isSubmitting ? 'Submitting...' : 'Submit'}
              </button>
            </div>
          </div>
        </form>
        {/* Add video end */}
      </FormProvider>
    </>
  );
};
export default UpdateModuleForm;
