'use client';
import ErrorMsg from '@/app/components/common/error-msg';
import { createBlog } from '@/lib/actions/blog.action';
import { notifyError, notifySuccess } from '@/utils/toast';
import { blogSchema } from '@/utils/validation';
import { zodResolver } from '@hookform/resolvers/zod';
import Image from 'next/image';
import React, { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import CreatableSelect from 'react-select/creatable';
import { z } from 'zod';

interface IProps {
  type: string;
}

const Blog = ({ type }: IProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [filename, setFilename] = useState('');
  const [imagePreview, setImagePreview] = useState<string | undefined>();
  const [progress, setProgress] = useState(0);
  type IBlogType = z.infer<typeof blogSchema>;
  // react hook form
  const methods = useForm<IBlogType>({
    resolver: zodResolver(blogSchema),
    defaultValues: {
      title: '',
      content: '',
      tags: [],
      image: {
        url: ''
      }
    }
  });
  const {
    handleSubmit,
    register,
    setValue,
    reset,
    control,

    formState: { errors }
  } = methods;

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
          setValue('image.url', pdfFile.result as string);
        }
      };

      pdfFile.onloadend = () => {
        setImagePreview(pdfFile.result as string | undefined);
      };
    }
    pdfFile.readAsDataURL(event.target.files?.[0] as File);
  };

  // on submit
  const onSubmit = async (data: IBlogType) => {
    setIsSubmitting(true);
    simulateProgress();
    try {
      if (type === 'add') {
        await createBlog({
          title: data.title,
          content: data.content,
          tags: data.tags,
          image: {
            url: data.image.url,
            public_id: ''
          }
        });
        setProgress(100);
        notifySuccess('BLog post created successfully!');
      }
    } catch (error: any) {
      console.log('onSubmit  error:', error);
      notifyError(error.message);
      setProgress(0);
    } finally {
      reset();
      setProgress(0);
      setIsSubmitting(false);
      setFilename('');
    }
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="bg-white card-box border-20">
        <div className="user-avatar-setting d-flex align-items-center mb-30">
          {imagePreview && (
            <Image
              src={imagePreview}
              alt="avatar"
              height={80}
              width={80}
              className="lazy-img user-img"
            />
          )}

          <div className="upload-btn w-auto px-3  position-relative tran3s ms-4 me-3">
            <small>{filename || ' Upload Thumbnail'}</small>
            {errors.image?.url && (
              <ErrorMsg msg={errors.image?.url?.message as string} />
            )}
            <Controller
              name="image.url"
              control={control}
              render={({ field }) => (
                <input
                  type="file"
                  id="uploadImg"
                  name="file"
                  accept="image/*"
                  placeholder="Upload new photo"
                  onChange={(e) => {
                    field.onChange(e);
                    handleFileChange(e);
                  }}
                />
              )}
            />
          </div>
        </div>
        <div className="dash-input-wrapper mb-30">
          <label htmlFor="">Title*</label>
          <input
            defaultValue={''}
            type="text"
            placeholder="You name"
            {...register('title')}
            name="title"
          />
          {errors.title && <ErrorMsg msg={errors.title?.message as string} />}
        </div>

        <div className="dash-input-wrapper mb-30">
          <label htmlFor="">Content*</label>
          <textarea
            className="size-lg"
            placeholder="Write something interesting about your blog title...."
            {...register('content')}
            name="content"
          ></textarea>
          <div className="alert-text">
            Brief description for your Blog. URLs are hyperlinked.
          </div>
          {errors.content && (
            <ErrorMsg msg={errors.content?.message as string} />
          )}
        </div>
        <div className="dash-input-wrapper mb-30">
          <label htmlFor="">Tags*</label>
          <Controller
            name="tags"
            control={control}
            render={({ field }) => (
              <CreatableSelect
                isMulti={true}
                {...field}
                className="basic-multi-select"
                classNamePrefix="select"
                onChange={(selectedOption) =>
                  field.onChange(
                    selectedOption?.map(
                      (option) => option?.value as string | null
                    )
                  )
                }
                value={field.value?.map((val: string) =>
                  val ? { value: val, label: val } : null
                )}
              />
            )}
          />
          {errors.tags && <ErrorMsg msg={errors.tags?.message as string} />}
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
          className="dash-btn-two tran3s me-3"
        >
          {isSubmitting ? 'Posting...' : 'Post'}
        </button>
      </div>
    </form>
  );
};
export default Blog;
