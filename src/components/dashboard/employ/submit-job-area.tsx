'use client';
import React, { useEffect, useRef, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { creatJobPost } from '@/lib/actions/job.action';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@clerk/nextjs';
import { notifyError, notifySuccess } from '@/utils/toast';
import { formJobDataSchema } from '@/utils/validation';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import ErrorMsg from '../../common/error-msg';
import Select from 'react-select';
import { ICategory } from '@/database/category.model';
import { getCategories } from '@/lib/actions/admin.action';
import { Editor } from '@tinymce/tinymce-react';
// props type
type IProps = {
  mongoUserId: string | undefined;
};

const SubmitJobArea = ({ mongoUserId }: IProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const editorRef = useRef(null);
  const [progress, setProgress] = useState(0);

  const [categories, setCategories] = useState<ICategory[]>([]);
  const [categoryOptions, setCategoryOptions] = useState([]);
  const { userId } = useAuth();

  const pathname = usePathname();
  const router = useRouter();
  const type = 'add';

  type IJobDataSchemaType = z.infer<typeof formJobDataSchema>;

  // react hook form
  const methods = useForm<IJobDataSchemaType>({
    resolver: zodResolver(formJobDataSchema),
    defaultValues: {
      title: '',
      overview: '',
      duration: '',
      category: ''
    }
  });
  const {
    handleSubmit,
    register,
    reset,
    control,
    formState: { errors }
  } = methods;

  useEffect(() => {
    const fetchCategories = async () => {
      const res = await getCategories();
      setCategories(res);
      const categoriesData = res?.map((item: any) => ({
        value: item.name,
        label: item.name
      }));
      setCategoryOptions(categoriesData);
    };
    fetchCategories();
  }, []);

  const simulateProgress = () => {
    let currentProgress = 0;

    const interval = setInterval(() => {
      currentProgress += 10;
      setProgress(currentProgress);

      if (currentProgress >= 100) {
        clearInterval(interval);
      }
    }, 500);
  };

  // on submit
  const onSubmit = async (data: IJobDataSchemaType) => {
    setIsSubmitting(true);
    simulateProgress();
    const {
      title,
      category,
      overview,
      duration
    } = data;

    const mongoData = {
      title,
      category,
      overview,
      duration
    };

    try {
      if (type === 'add') {
        // !Error: this function is calling two times
        const res = await creatJobPost({
          data: mongoData,
          clerkId: userId,
          createdBy: mongoUserId,
          path: pathname
        });
        if (res.success) {
          notifySuccess(res.message);
          setProgress(100);
          router.push('/dashboard/employ-dashboard/jobs');
        }
        if (res.error) {
          notifyError(res.message);
        }
      }
    } catch (error: any) {
      console.log('onSubmit  error:', error);
      notifyError(error);
    } finally {
      reset();
      setProgress(0);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="position-relative">
      {/* form start */}
      <form onSubmit={handleSubmit(onSubmit)}>
        <h2 className="main-title">Post a New Job</h2>
        <div className="bg-white card-box border-20">
          <h4 className="dash-title-three">Job Details</h4>
          <div className="dash-input-wrapper mb-30">
            <label htmlFor="">Job Title*</label>
            <input
              type="text"
              placeholder="Ex: Product Designer"
              {...register('title', { required: `Title is required!` })}
              name="title"
            />
            {errors?.title && <ErrorMsg msg={errors?.title.message} />}
          </div>
          <div className="dash-input-wrapper mb-30">
            <label htmlFor="">Job Description*</label>
            <Controller
              name="overview"
              control={control}
              render={({ field }) => (
                <Editor
                  apiKey={process.env.NEXT_PUBLIC_TINY_EDITOR_API_KEY}
                  onInit={(evt, editor) => {
                    // @ts-ignore
                    editorRef.current = editor;
                  }}
                  onBlur={field.onBlur}
                  onEditorChange={(content) => field.onChange(content)}
                  initialValue={''}
                  init={{
                    height: 350,
                    menubar: false,
                    plugins: [
                      'advlist',
                      'autolink',
                      'lists',
                      'link',
                      'image',
                      'charmap',
                      'preview',
                      'anchor',
                      'searchreplace',
                      'visualblocks',
                      'codesample',
                      'fullscreen',
                      'insertdatetime',
                      'media',
                      'table'
                    ],
                    toolbar:
                      'undo redo | casechange blocks | bold italic backcolor | ' +
                      'alignleft aligncenter alignright alignjustify | ' +
                      'bullist numlist checklist outdent indent | removeformat | a11ycheck ',
                    content_style: 'body { font-family:Inter; font-size:16px }',
                    skin: 'oxide',
                    content_css: 'light'
                  }}
                />
              )}
            />
            {errors?.overview && <ErrorMsg msg={errors?.overview.message} />}
          </div>
          <div className="row align-items-end">
            <div className="col-md-6 mb-30">
              <label className="fw-semibold pb-1" htmlFor="">
                Job Category
              </label>
              <Controller
                name="category"
                control={control}
                render={({ field }) => (
                  <>
                    <Select
                      {...field}
                      isClearable
                      options={categoryOptions || []}
                      className="basic-multi-select"
                      classNamePrefix="select"
                      onChange={(selectedOption) => {
                        field.onChange(selectedOption?.value);
                      }}
                      value={
                        field.value
                          ? { value: field.value, label: field.value }
                          : null
                      }
                    />
                    {errors?.category && (
                      <ErrorMsg msg={errors?.category?.message} />
                    )}
                  </>
                )}
              />
            </div>
            <div className="col-md-6">
              <div className=" mb-30">
                <label className="fw-semibold pb-1" htmlFor="">
                  Job Type
                </label>
                <Controller
                  name="duration"
                  control={control}
                  render={({ field }) => (
                    <>
                      <Select
                        {...field}
                        isClearable
                        options={[
                          { value: 'Full time', label: 'Full time' },
                          { value: 'Part time', label: 'Part time' },
                          {
                            value: 'Hourly-Contract',
                            label: 'Hourly-Contract'
                          },
                          { value: 'Fixed-Price', label: 'Fixed-Price' }
                        ]}
                        className="basic-multi-select"
                        classNamePrefix="select"
                        onChange={(selectedOption) => {
                          field.onChange(selectedOption?.value);
                        }}
                        value={
                          field.value
                            ? { value: field.value, label: field.value }
                            : null
                        }
                      />
                      {errors?.duration && (
                        <ErrorMsg msg={errors?.duration.message} />
                      )}
                    </>
                  )}
                />
              </div>
            </div>
          </div>

          {/* file attachment start */}
          {/* <h4 className="dash-title-three pt-50 lg-pt-30">File Attachment</h4>
          <div className="dash-input-wrapper mb-20">
            <label htmlFor="">File Attachment*</label>
            <div className="attached-file d-flex align-items-center justify-content-between mb-15">
              <span>guidline&requirments.doc</span>
              <a href="#" className="remove-btn">
                <i className="bi bi-x"></i>
              </a>
            </div>
          </div>
          <div className="dash-btn-one d-inline-block position-relative me-3">
            <i className="bi bi-plus"></i>
            Upload File
            <div id="uploadCV"></div>
          </div>
          <small>Upload file .pdf, .doc, .docx</small> */}
          {/* file attachment end */}
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
            className="dash-btn-two tran3s me-3"
          >
            {isSubmitting ? 'Submitting...' : 'Submit'}
          </button>
          <button onClick={() => reset()} className="dash-cancel-btn tran3s">
            Cancel
          </button>
        </div>
      </form>

      {/* form end */}
    </div>
  );
};

export default SubmitJobArea;
