'use client';
import ErrorMsg from '@/app/components/common/error-msg';
import { IBlog } from '@/database/Blog.model';
import { createBlog, updateBlogById } from '@/lib/actions/blog.action';
import { notifyError, notifySuccess } from '@/utils/toast';
import { blogSchema } from '@/utils/validation';
import { zodResolver } from '@hookform/resolvers/zod';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import React, { useEffect, useRef, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import CreatableSelect from 'react-select/creatable';
import { z } from 'zod';
import { Editor } from '@tinymce/tinymce-react';

interface IProps {
  type: string;
  blog?: IBlog;
}

const Blog = ({ type, blog }: IProps) => {
  const pathname = usePathname();
  const editorRef = useRef(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [filename, setFilename] = useState('');
  const [imagePreview, setImagePreview] = useState<string | undefined>(
    blog?.image.url || ''
  );
  const [progress, setProgress] = useState(0);
  type IBlogType = z.infer<typeof blogSchema>;
  // react hook form
  const methods = useForm<IBlogType>({
    resolver: zodResolver(blogSchema),
    defaultValues: {
      title: blog?.title || '',
      content: blog?.content || '',
      tags: blog?.tags || [],
      image: {
        url: blog?.image.url || '',
        public_id: blog?.image?.public_id || ''
      }
    }
  });
  const {
    handleSubmit,
    setValue,
    reset,
    control,
    formState: { errors }
  } = methods;

  useEffect(() => {
    reset();
  }, [reset]);

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
      } else {
        //  update blog
        await updateBlogById({
          blogId: blog?._id as string,
          newData: {
            title: data.title,
            content: data.content,
            tags: data.tags,
            image: {
              url: data.image.url,
              public_id: data?.image?.public_id || ''
            }
          },
          path: pathname
        });
        setProgress(100);
        notifySuccess('Blog updated successfully!');
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
          <Controller
            name="title"
            control={control}
            defaultValue={blog?.title || ''}
            render={({ field }) => (
              <input type="text" placeholder="Your name" {...field} />
            )}
          />
          {errors.title && <ErrorMsg msg={errors.title?.message as string} />}
        </div>

        <div className="dash-input-wrapper mb-30">
          <label htmlFor="">Content*</label>
          <Controller
            name="content"
            control={control}
            defaultValue={blog?.content || ''}
            render={({ field }) => (
              <Editor
                apiKey={process.env.NEXT_PUBLIC_TINY_EDITOR_API_KEY}
                onInit={(evt, editor) => {
                  // @ts-ignore
                  editorRef.current = editor;
                }}
                onBlur={field.onBlur}
                onEditorChange={(content) => field.onChange(content)}
                initialValue={blog?.content || ''}
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
                    'undo redo | ' +
                    ' bold italic forecolor | alignleft aligncenter |' +
                    'alignright alignjustify | bullist numlist',
                  content_style: 'body { font-family:Inter; font-size:16px }',
                  skin: 'oxide',
                  content_css: 'light'
                }}
              />
            )}
          />
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
            defaultValue={blog?.tags || []}
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
