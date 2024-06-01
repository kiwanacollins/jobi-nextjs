'use client';
import { Controller, FormProvider, useForm } from 'react-hook-form';
import { useEffect, useState } from 'react';
import avatarPerson from '@/assets/images/avatar-person.svg';
import { courseSchema } from '@/utils/validation';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { notifySuccess, notifyError } from '@/utils/toast';
import Image from 'next/image';
import ErrorMsg from '../common/error-msg';
import { createNewCourse, updateCourse } from '@/lib/actions/Course.action';
import { ICourse } from '@/database/Course.model';
import { usePathname } from 'next/navigation';

interface ICourseFormProps {
  type: string;
  loggedInUserId: string;
  courseData?: ICourse;
}

const CourseForm = ({ type, loggedInUserId, courseData }: ICourseFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | undefined>(
    courseData?.thumbnail.url || ''
  );
  const [filename, setFilename] = useState('');
  const [progress, setProgress] = useState(0);
  const pathname = usePathname();

  const simulateProgress = () => {
    let currentProgress = 0;

    const interval = setInterval(() => {
      currentProgress += 10;
      setProgress(currentProgress);

      if (currentProgress >= 100) {
        clearInterval(interval);
      }
    }, 500); // Adjust the interval and steps based on your preference
  };

  type courseSchemaType = z.infer<typeof courseSchema>;
  const methods = useForm<courseSchemaType>({
    resolver: zodResolver(courseSchema),
    defaultValues: {
      title: courseData?.title || '',
      introVideo: courseData?.introVideo || '',
      description: courseData?.description || '',
      thumbnail: {
        url: courseData?.thumbnail.url || '',
        public_id: courseData?.thumbnail.public_id || ''
      }
    }
  });

  const {
    reset,
    setValue,
    clearErrors,
    control,
    handleSubmit,
    formState: { errors }
  } = methods;

  // handle file pdf upload
  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    event.preventDefault();
    const pdfFile = new FileReader();
    const selectedFile = event.target.files?.[0] || null;

    const fileName = selectedFile?.name || '';
    setFilename(fileName);
    if (event.target.name === 'file') {
      pdfFile.onload = () => {
        if (pdfFile.readyState === 2) {
          setValue('thumbnail.url', pdfFile.result as string);
          clearErrors('thumbnail.url');
        }
      };

      pdfFile.onloadend = () => {
        setImagePreview(pdfFile.result as string | undefined);
      };
    }
    pdfFile.readAsDataURL(event.target.files?.[0] as File);
  };

  const onSubmit = async (data: courseSchemaType) => {
    setIsSubmitting(true);
    simulateProgress();

    try {
      // Call the API to create a new course
      if (type === 'add') {
        const res = await createNewCourse({
          title: data.title,
          introVideo: data.introVideo,
          description: data.description,
          creator: loggedInUserId,
          thumbnail: {
            url: data.thumbnail.url
          }
        });
        if (res.success) {
          setProgress(100);
          notifySuccess(res.message);
        }
        if (res.error) {
          notifyError(res.message);
        }
      }
      if (type === 'edit') {
        const res = await updateCourse({
          courseId: courseData?._id,
          updateData: {
            title: data.title,
            introVideo: data.introVideo,
            description: data.description,
            creator: loggedInUserId,
            thumbnail: {
              url: data.thumbnail.url
            }
          },
          path: pathname
        });
        if (res.success) {
          setProgress(100);
          notifySuccess(res.message);
        }
        if (res.error) {
          notifyError(res.message);
        }
      }
    } catch (error: any) {
      console.log('error', error);
      notifyError(error.message as string);
    } finally {
      setIsSubmitting(false);
      setProgress(0);
      setImagePreview(undefined);
      setFilename('');
    }
  };

  useEffect(() => {
    reset();
  }, [reset]);

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="bg-white card-box border-20">
          <div className="user-avatar-setting d-flex align-items-center mb-30">
            {errors?.thumbnail?.url ? (
              <ErrorMsg msg={errors?.thumbnail?.url.message} />
            ) : (
              <Image
                src={imagePreview || courseData?.thumbnail.url || avatarPerson}
                alt="avatar"
                height={200}
                width={200}
                className="lazy-img user-img"
              />
            )}
            <div className="upload-btn position-relative tran3s ms-4 me-3">
              <small>{filename || ' Upload Thumbnail'}</small>

              <Controller
                name="thumbnail.url"
                control={control}
                rules={{ required: 'Image is required' }}
                render={() => (
                  <>
                    <input
                      type="file"
                      id="uploadImg"
                      name="file"
                      accept="image/*"
                      placeholder="Upload Image"
                      onChange={(e) => handleFileChange(e)}
                    />
                    {/* {errors.thumbnail?.url && (
                      <ErrorMsg msg={errors.thumbnail.url.message} />
                    )} */}
                  </>
                )}
              />
            </div>
          </div>
          <div className="dash-input-wrapper mb-30">
            <label htmlFor="">Course Title*</label>
            <Controller
              name="title"
              control={control}
              defaultValue="" // You can set a default value if needed
              render={({ field }) => (
                <input
                  {...field}
                  type="text"
                  id="courseTitle"
                  placeholder="Your course title"
                />
              )}
            />
            {
              // Show error message
              errors.title && <ErrorMsg msg={errors.title.message} />
            }
          </div>
          <div className="dash-input-wrapper mb-30">
            <label htmlFor="">Intro Video Id*</label>
            <Controller
              name="introVideo"
              control={control}
              defaultValue="" // You can set a default value if needed
              render={({ field }) => (
                <input
                  {...field}
                  type="text"
                  id="introVideo"
                  placeholder="course intro video id"
                />
              )}
            />
            {
              // Show error message
              errors.introVideo && <ErrorMsg msg={errors.introVideo.message} />
            }
          </div>

          <div className="dash-input-wrapper">
            <label htmlFor="">Description*</label>
            <Controller
              name="description"
              control={control}
              defaultValue="" // You can set a default value if needed
              render={({ field }) => (
                <textarea
                  {...field}
                  className="size-lg"
                  placeholder="Write something interesting about the course...."
                ></textarea>
              )}
            />
            <div className="alert-text">
              Brief description for Course. URLs are hyperlinked.
            </div>
            {
              // Show error message
              errors.description && (
                <ErrorMsg msg={errors?.description.message} />
              )
            }
          </div>
        </div>

        {/* Progress bar */}
        {isSubmitting && (
          <div className="progress">
            <div
              className="progress-bar progress-bar-striped progress-bar-animated"
              role="progressbar"
              style={{ width: `${progress}%` }}
              aria-valuenow={progress}
              aria-valuemin={0}
              aria-valuemax={100}
            >
              {progress}%
            </div>
          </div>
        )}

        <div className="button-group d-inline-flex align-items-center mt-30">
          <button
            disabled={isSubmitting}
            type="submit"
            className="dash-btn-two tran3s me-3 px-4"
          >
            {isSubmitting ? (
              <>{type === 'edit' ? 'Updating...' : 'Creating...'}</>
            ) : (
              <>{type === 'add' ? 'Create Course' : 'Update Course'}</>
            )}
          </button>
          <button className="dash-cancel-btn tran3s">Cancel</button>
        </div>
      </form>
    </FormProvider>
  );
};
export default CourseForm;
