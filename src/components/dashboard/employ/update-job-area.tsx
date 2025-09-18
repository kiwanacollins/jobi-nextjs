'use client';
import React, { useEffect, useRef, useState } from 'react';
// Simplified to match create form fields
import { Controller, useForm } from 'react-hook-form';
import { notifyError, notifySuccess } from '@/utils/toast';
import { formJobDataSchema } from '@/utils/validation';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import ErrorMsg from '../../common/error-msg';
import Select from 'react-select';
import { IJobData } from '@/database/job.model';
import { updateJobById } from '@/lib/actions/job.action';
import { usePathname } from 'next/navigation';
import { ICategory } from '@/database/category.model';
import { getCategories } from '@/lib/actions/admin.action';
import { Editor } from '@tinymce/tinymce-react';

interface IProps {
  job: IJobData;
}

const UpdateJobArea = ({ job }: IProps) => {
  const pathname = usePathname();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const editorRef = useRef(null);
  const [progress, setProgress] = useState(0);
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [categoryOptions, setCategoryOptions] = useState([]);

  type IJobDataSchemaType = z.infer<typeof formJobDataSchema>;

  // react hook form
  const methods = useForm<IJobDataSchemaType>({
    resolver: zodResolver(formJobDataSchema),
    defaultValues: {
      title: job?.title || '',
      overview: job?.overview || '',
      duration: job?.duration || '',
      category: job?.category || '',
      company: job?.company || '',
      companyImage: job?.companyImage || '',
      location: job?.location || '',
      deadline: job?.deadline ? new Date(job.deadline).toISOString().split('T')[0] : '',
      // keep schema optional fields untouched; we won't render them here
    }
  });
  const { handleSubmit, register, reset, control, formState: { errors } } = methods;

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
    }, 500); // Adjust the interval and steps based on your preference
  };

  // on submit
  const onSubmit = async (data: IJobDataSchemaType) => {
    // console.log('data', data);
    setIsSubmitting(true);
    simulateProgress();

    try {
      // todo: update job data
      const res = await updateJobById({
        jobId: job._id,
        updateData: {
          title: data.title,
          overview: data.overview,
          duration: data.duration,
          category: data.category,
          location: data.location,
          company: data.company,
          companyImage: data.companyImage,
          deadline: data.deadline ? new Date(data.deadline) : undefined
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
    } catch (error: any) {
      console.log('onSubmit  error:', error);
      notifyError(error.message || 'Failed to Update post!');
      setProgress(0);
    } finally {
      setProgress(0);
      setIsSubmitting(false);
    }
  };
  useEffect(() => {
    reset();
  }, [reset]);

  return (
    <div className="position-relative">
      {/* form start */}
      <form onSubmit={handleSubmit(onSubmit)}>
        <h2 className="main-title">Edit Job</h2>
        <div className="bg-white card-box border-20">
          <h4 className="dash-title-three">Job Details</h4>
          <div className="dash-input-wrapper mb-30">
            <label htmlFor="">Job Title*</label>
            <input
              type="text"
              placeholder="Ex: Product Designer"
              defaultValue={job.title || ''}
              {...register('title', { required: `Title is required!` })}
              name="title"
            />
            {errors?.title && <ErrorMsg msg={errors?.title.message} />}
          </div>
          <div className="row">
            <div className="col-md-6">
              <div className="dash-input-wrapper mb-30">
                <label htmlFor="">Company Name*</label>
                <input
                  type="text"
                  placeholder="Ex: Exquisite Solution Limited"
                  {...register('company', { required: `Company name is required!` })}
                  name="company"
                />
                {errors?.company && <ErrorMsg msg={errors?.company.message} />}
              </div>
            </div>
            <div className="col-md-6">
              <div className="dash-input-wrapper mb-30">
                <label htmlFor="">Company Logo (Image URL)</label>
                <input
                  type="url"
                  placeholder="https://example.com/company-logo.png"
                  {...register('companyImage')}
                  name="companyImage"
                />
                {errors?.companyImage && <ErrorMsg msg={errors?.companyImage.message} />}
                <small className="text-muted">Provide a direct URL to your company logo image</small>
              </div>
            </div>
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
                  initialValue={job?.overview || ''}
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
          <div className="row">
            <div className="col-md-6">
              <div className="dash-input-wrapper mb-30">
                <label htmlFor="">Location*</label>
                <input
                  type="text"
                  placeholder="Ex: Kampala"
                  {...register('location', { required: `Location is required!` })}
                  name="location"
                />
                {errors?.location && <ErrorMsg msg={errors?.location.message} />}
              </div>
            </div>
            <div className="col-md-6">
              <div className="dash-input-wrapper mb-30">
                <label htmlFor="">Application Deadline*</label>
                <input
                  type="date"
                  {...register('deadline', { required: `Deadline is required!` })}
                  name="deadline"
                />
                {errors?.deadline && <ErrorMsg msg={errors?.deadline.message} />}
              </div>
            </div>
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

          {/* File attachment placeholder retained as in create form (commented) */}
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
          {/* File attachment End */}
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

export default UpdateJobArea;
