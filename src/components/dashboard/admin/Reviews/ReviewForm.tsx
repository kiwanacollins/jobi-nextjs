'use client';
import ErrorMsg from '@/components/common/error-msg';
import avatarPerson from '@/assets/images/avatar-person.svg';
import { notifyError, notifySuccess } from '@/utils/toast';
import { TestimonialSchema } from '@/utils/validation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { Controller, FormProvider, useForm } from 'react-hook-form';
import { z } from 'zod';
import Image from 'next/image';
import { Country, ICountry } from 'country-state-city';
import Select from 'react-select';
import {
  createTestimonial,
  updateTestimonial
} from '@/lib/actions/Testimonial.action';
import { usePathname, useRouter } from 'next/navigation';

interface ReviewFormProps {
  type: string;
  reviewId?: string;
  reviewData?: any;
}
const ReviewForm = ({ type, reviewData, reviewId }: ReviewFormProps) => {
  const pathname = usePathname();
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [filename, setFilename] = useState('');
  const [imagePreview, setImagePreview] = useState<string | undefined>();

  const countries: ICountry[] = Country.getAllCountries();
  const countryOptions = countries.map((country) => ({
    value: country.name,
    label: country.name
  }));

  type TestimonialSchemaType = z.infer<typeof TestimonialSchema>;
  const methods = useForm<TestimonialSchemaType>({
    resolver: zodResolver(TestimonialSchema),
    defaultValues: {
      review_text: reviewData?.review_text || '',
      review_star: reviewData?.review_star || 0,
      desc: reviewData?.desc || '',
      name: reviewData?.name || '',
      location: reviewData?.location || '',
      image: {
        url: reviewData?.image.url || '',
        public_id: reviewData?.image.public_id || ''
      }
    }
  });

  const {
    reset,
    register,
    setValue,
    clearErrors,
    control,
    handleSubmit,
    formState: { errors }
  } = methods;

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
          clearErrors('image.url');
        }
      };

      pdfFile.onloadend = () => {
        setImagePreview(pdfFile?.result as string | undefined);
      };
    }
    pdfFile.readAsDataURL(event.target.files?.[0] as File);
  };

  const onSubmit = async (data: TestimonialSchemaType) => {
    setIsSubmitting(true);
    try {
      // Call the API to create a new course
      if (type === 'add') {
        const res = await createTestimonial(data);
        if (res.success) {
          notifySuccess(res.message);
          setIsSubmitting(false);
          router.push('/dashboard/admin-dashboard/reviews')
          reset();
        }
        if (res.error) {
          notifyError(res.message);
          setIsSubmitting(false);
        }
      }
      if (type === 'edit') {
        const res = await updateTestimonial({
          reviewId: reviewId as string,
          updataData: data,
          path: pathname
        });
        if (res.success) {
          notifySuccess(res.message);
          router.push('/dashboard/admin-dashboard/reviews')
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
      setFilename('');
      setImagePreview('');
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
            {errors.image?.url ? (
              <ErrorMsg msg={errors.image.url.message} />
            ) : (
              <Image
                src={imagePreview || reviewData?.image.url || avatarPerson}
                alt="avatar"
                height={200}
                width={200}
                className="lazy-img user-img"
              />
            )}
            <div className="upload-btn position-relative tran3s ms-4 me-3">
              <small>{filename || ' Upload Image'}</small>
              <Controller
                name="image.url"
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
                    {/* {errors.image?.url && (
                      <ErrorMsg msg={errors.image.url.message} />
                    )} */}
                  </>
                )}
              />
            </div>
          </div>

          <div className="dash-input-wrapper mb-30">
            <label htmlFor="">Name*</label>
            <Controller
              name="name"
              control={control}
              defaultValue="" // You can set a default value if needed
              render={({ field }) => (
                <input
                  {...field}
                  type="text"
                  id="title"
                  placeholder="Enter reviewer name"
                />
              )}
            />
            {
              // Show error message
              errors.name && <ErrorMsg msg={errors.name.message} />
            }
          </div>
          <div className="dash-input-wrapper mb-30">
            <label htmlFor="">Review Text*</label>
            <Controller
              name="review_text"
              control={control}
              defaultValue="" // You can set a default value if needed
              render={({ field }) => (
                <input
                  {...field}
                  type="text"
                  id="review_text"
                  placeholder="Enter review text"
                />
              )}
            />
            {
              // Show error message
              errors.review_text && (
                <ErrorMsg msg={errors.review_text.message} />
              )
            }
          </div>
          <div className="dash-input-wrapper mb-30">
            <label htmlFor="">Review Star*</label>

            <input
              type="number"
              id="review_star"
              {...register('review_star', {
                setValueAs: (v) => (v === '' ? undefined : parseInt(v))
              })}
              placeholder="Enter review (1-5)"
            />

            {
              // Show error message
              errors.review_star && (
                <ErrorMsg msg={errors.review_star.message} />
              )
            }
          </div>
          <div className="dash-input-wrapper mb-30">
            <label htmlFor="">Location*</label>
            <Controller
              name="location"
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  //@ts-ignore
                  options={countryOptions || []}
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
              )}
            />
            {errors?.location && (
              <ErrorMsg msg={errors?.location?.message as string} />
            )}
          </div>

          <div className="dash-input-wrapper">
            <label htmlFor="">Review*</label>
            <Controller
              name="desc"
              control={control}
              defaultValue="" // You can set a default value if needed
              render={({ field }) => (
                <textarea
                  {...field}
                  className="size-lg"
                  placeholder="Write review here..."
                ></textarea>
              )}
            />
            <div className="alert-text">Brief review description</div>
            {
              // Show error message
              errors.desc && <ErrorMsg msg={errors?.desc.message} />
            }
          </div>
        </div>

        <div className="button-group d-inline-flex align-items-center mt-30">
          <button
            disabled={isSubmitting}
            type="submit"
            className="dash-btn-two tran3s me-3 px-4"
          >
            {isSubmitting ? (
              <>{type === 'edit' ? 'Updating...' : 'Saving...'}</>
            ) : (
              <>{type === 'edit' ? 'Update' : 'Submit'}</>
            )}
          </button>
        </div>
      </form>
    </FormProvider>
  );
};
export default ReviewForm;
