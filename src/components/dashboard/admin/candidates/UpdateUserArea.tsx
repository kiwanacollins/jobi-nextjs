'use client';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { useForm, FormProvider, Controller } from 'react-hook-form';
import { updateUserByAdmin } from '@/lib/actions/user.action';
import avatarPerson from '@/assets/images/avatar-person.svg';
import * as z from 'zod';
import { notifyError, notifySuccess } from '@/utils/toast';
import ErrorMsg from '@/components/common/error-msg';
import { userSchema } from '@/utils/validation';
import { zodResolver } from '@hookform/resolvers/zod';
import { IUser } from '@/database/user.model';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Country, ICountry } from 'country-state-city';
import Select from 'react-select';
import { ICategory } from '@/database/category.model';
import {
  englishLevelOptions,
  experienceOptions,
  genderOptions,
  qualificationOptions
} from '@/constants';

interface IParamsProps {
  mongoUser: IUser;
  categoryOptions: {
    value: string;
    label: string;
  }[];
  subCategories: {
    value: string;
    label: string;
  }[];
  categories: ICategory[];
}

const UpdateUserArea = ({
  mongoUser,
  categoryOptions,
  subCategories,
  categories
}: IParamsProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [filename, setFilename] = useState('');
  const [imagePreview, setImagePreview] = useState<string | undefined>('');
  const pathname = usePathname();

  const countries: ICountry[] = Country.getAllCountries();
  const countryOptions = countries.map((country) => ({
    value: country.name,
    label: country.name
  }));

  type userSchemaType = z.infer<typeof userSchema>;

  const methods = useForm<userSchemaType>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      name: mongoUser?.name || '',
      phone: mongoUser?.phone || '',
      picture: mongoUser?.picture || '',
      post: mongoUser?.post || '',
      age: mongoUser?.age,
      email: mongoUser?.email || '',
      skills: mongoUser?.skills || [],
      gender: mongoUser?.gender || '',
      // salary_duration: mongoUser?.salary_duration,
      // maxSalary: mongoUser?.maxSalary,
      // minSalary: mongoUser?.minSalary,
      qualification: mongoUser?.qualification,
      experience: mongoUser?.experience || '',
      english_fluency: mongoUser?.english_fluency || '',
      bio: mongoUser?.bio,
      mediaLinks: {
        linkedin: mongoUser?.mediaLinks?.linkedin || '',
        github: mongoUser?.mediaLinks?.github || ''
      },
      address: mongoUser?.address || '',
      country: mongoUser?.country || ''
    }
  });
  const isResumeExist = !!mongoUser?.resumeId;
  const resumeHref =
    mongoUser.role === 'candidate'
      ? `/dashboard/candidate-dashboard/resume/new/${mongoUser._id}`
      : `/dashboard/admin-dashboard/candidate/addresume/${mongoUser._id}`;

  const {
    register,
    reset,
    setValue,
    clearErrors,
    control,
    handleSubmit,
    watch,
    formState: { errors }
  } = methods;

  useEffect(() => {
    reset();
  }, [reset]);

  const selectedPost = watch('post');
  const skillsOfSelectedPost = categories?.find(
    (cat: any) => cat?.name === selectedPost
  );

  const selectedPostSkills = skillsOfSelectedPost?.subcategory?.map(
    (item: any) => ({
      value: item.name,
      label: item.name
    })
  );

  // handle file pdf upload
  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    event.preventDefault();
    const pdfFile = new FileReader();
    const selectedFile = event.target.files?.[0] || null;

    const fileName = selectedFile?.name;
    setFilename(fileName as string);
    if (event.target.name === 'file') {
      pdfFile.onload = () => {
        if (pdfFile.readyState === 2) {
          setValue('picture', pdfFile.result as string);
          clearErrors('picture');
        }
      };

      pdfFile.onloadend = () => {
        setImagePreview(pdfFile.result as string | undefined);
      };
    }
    pdfFile.readAsDataURL(event.target.files?.[0] as File);
  };

  // Simulate progress function
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

  const onSubmit = async (value: userSchemaType) => {
    setIsSubmitting(true);
    simulateProgress();

    try {
      const res = await updateUserByAdmin({
        mongoId: mongoUser?._id,
        updateData: {
          name: value?.name,
          email: value.email,
          post: value.post,
          bio: value.bio,
          // salary_duration: value.salary_duration,
          experience: value.experience,
          phone: value.phone,
          age: value.age,
          picture: value.picture,
          gender: value.gender,
          english_fluency: value.english_fluency,
          qualification: value.qualification,
          skills: value.skills,
          // minSalary: value.minSalary,
          // maxSalary: value.maxSalary,
          mediaLinks: {
            linkedin: value.mediaLinks?.linkedin,
            github: value.mediaLinks?.github
          },
          address: value.address,
          country: value.country
        },
        path: pathname
      });
      if (res?.success) {
        setProgress(100);
        notifySuccess(res.message);
      }
      if (res?.error) {
        notifyError(res.message);
      }
    } catch (error: any) {
      notifyError(error.message as string);
      console.log(error);
    } finally {
      setIsSubmitting(false);
      setProgress(0);
    }
  };

  // useEffect(() => {
  //   reset();
  // }, [reset]);

  return (
    <>
      <h2 className="main-title">Update User</h2>
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="bg-white card-box border-20">
            <div className="user-avatar-setting d-flex align-items-center mb-30">
              {errors?.picture ? (
                <ErrorMsg msg={errors?.picture.message} />
              ) : (
                <Image
                  src={imagePreview || mongoUser?.picture || avatarPerson}
                  alt="avatar"
                  height={200}
                  width={200}
                  className="lazy-img user-img"
                />
              )}

              <div className="upload-btn position-relative tran3s ms-4 me-3">
                <small>{filename || ' Upload new photo'}</small>

                <Controller
                  name="picture"
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
                      {errors?.picture && (
                        <ErrorMsg msg={errors?.picture.message} />
                      )}
                    </>
                  )}
                />
              </div>
              {/* <button className="delete-btn tran3s">Delete</button> */}
            </div>

            <div>
              {!isResumeExist && (
                <p className="text-danger">
                  You need to add your result to publish your candidate profile{' '}
                </p>
              )}
              {mongoUser?._id && (
                <Link href={resumeHref} className="btn btn-primary mb-3">
                  {mongoUser?.resumeId ? 'Update Resume' : 'Add Resume'}
                </Link>
              )}
            </div>

            <div className="dash-input-wrapper mb-30">
              <label htmlFor="">Full Name*</label>
              <Controller
                name="name"
                control={control}
                defaultValue={mongoUser?.name || ''}
                render={({ field }) => (
                  <input type="text" placeholder="Your fullname" {...field} />
                )}
              />
              {errors?.name ? (
                <ErrorMsg msg={errors?.name?.message as string} />
              ) : null}
            </div>

            <div className="dash-input-wrapper mb-30">
              <label htmlFor="">Email*</label>
              <Controller
                name="email"
                control={control}
                defaultValue={mongoUser?.email || ''}
                rules={{ required: true }}
                render={({ field }) => (
                  <input
                    type="email"
                    placeholder="Your email address"
                    disabled={mongoUser?.role === 'candidate'}
                    {...field}
                  />
                )}
              />
              {errors?.email ? (
                <ErrorMsg msg={errors?.email?.message as string} />
              ) : null}
            </div>
            <div className="dash-input-wrapper mb-30">
              <label htmlFor="">post*</label>
              <input
                type="text"
                placeholder="Designation"
                {...register('post', { required: true })}
                defaultValue={mongoUser?.post}
                name="post"
              />
              <ErrorMsg msg={errors?.post?.message as string} />
            </div>
            <div className="dash-input-wrapper mb-30">
              <label htmlFor="">Phone</label>
              <input
                type="text"
                placeholder="017xxxxxxxxx"
                {...register('phone')}
                defaultValue={mongoUser?.phone}
                name="phone"
              />
              {errors?.phone && (
                <ErrorMsg msg={errors?.phone?.message as string} />
              )}
            </div>
            {/* age start */}
            <div className="dash-input-wrapper mb-30">
              <label htmlFor="">age</label>
              <input
                type="text"
                defaultValue={mongoUser?.age?.toString() || ''}
                placeholder="your age"
                {...register('age')}
                name="age"
              />
              {errors.age && <ErrorMsg msg={errors?.age?.message as string} />}
            </div>
            {/* age end */}

            {/* Gender Start */}
            <div className="mb-30">
              <label className="fw-semibold mb-2">Gender</label>
              <div>
                <Controller
                  name="gender"
                  control={control}
                  render={({ field }) => (
                    <Select
                      {...field}
                      isClearable
                      options={genderOptions || []}
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
              </div>
              {errors?.gender && (
                <ErrorMsg msg={errors?.gender?.message as string} />
              )}
            </div>
            {/* Gender end */}
            {/* Qualification Start */}
            <div className="dash-input-wrapper mb-25">
              <label htmlFor="">Qualification*</label>
              <Controller
                name="qualification"
                control={control}
                render={({ field }) => (
                  <Select
                    {...field}
                    options={qualificationOptions || []}
                    onChange={(selectedOption) =>
                      field.onChange(selectedOption?.value)
                    }
                    value={
                      field.value
                        ? { value: field.value, label: field.value }
                        : null
                    }
                    isClearable
                    placeholder="Select Qualification"
                  />
                )}
              />

              {errors?.qualification && (
                <ErrorMsg msg={errors?.qualification?.message as string} />
              )}
            </div>
            {/* Qualification End */}

            {/* Skills start */}
            <div className="dash-input-wrapper mb-30">
              <label htmlFor="">post*</label>
              <Controller
                name="post"
                control={control}
                render={({ field }) => (
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
                )}
              />
              {errors?.post && (
                <ErrorMsg msg={errors?.post?.message as string} />
              )}
            </div>
            <div className="dash-input-wrapper mb-30">
              <label htmlFor="">Skills*</label>
              <Controller
                name="skills"
                control={control}
                render={({ field }) => (
                  <Select
                    isMulti
                    {...field}
                    //@ts-ignore
                    options={
                      selectedPost ? selectedPostSkills : subCategories || []
                    }
                    className="basic-multi-select"
                    classNamePrefix="select"
                    onChange={(selectedOption) =>
                      field.onChange(
                        selectedOption?.map(
                          (option) => option?.value as string | null
                        )
                      )
                    }
                    value={field.value?.map((val) =>
                      val ? { value: val, label: val } : null
                    )}
                  />
                )}
              />
              {errors?.skills && (
                <ErrorMsg msg={errors?.skills?.message as string} />
              )}
            </div>

            {/* Skills end */}

            {/* Experience start */}

            <div className="row align-items-end">
              <div className="col-md-6">
                <div className="mb-30">
                  <label className="fw-semibold mb-2" htmlFor="">
                    Experience*
                  </label>

                  <Controller
                    name="experience"
                    control={control}
                    render={({ field }) => (
                      <Select
                        {...field}
                        options={experienceOptions || []}
                        isClearable
                        placeholder="Select Experience"
                        onChange={(selectedOption) =>
                          field.onChange(selectedOption?.value)
                        }
                        value={
                          field.value
                            ? { value: field.value, label: field.value }
                            : null
                        }
                      />
                    )}
                  />
                  {errors?.experience && (
                    <ErrorMsg msg={errors?.experience?.message as string} />
                  )}
                </div>
              </div>

              {/* Experience end */}

              {/* English Fluency start */}
              <div className="col-md-6">
                <div className=" mb-30">
                  <label className="fw-semibold mb-2" htmlFor="">
                    English Fluency
                  </label>
                  <Controller
                    name="english_fluency"
                    control={control}
                    render={({ field }) => (
                      <Select
                        {...field}
                        options={englishLevelOptions || []}
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
                    )}
                  />
                  <ErrorMsg msg={errors?.english_fluency?.message} />
                </div>
              </div>
              {/* English Fluency End */}
            </div>

            <div className="dash-input-wrapper">
              <label htmlFor="">Bio*</label>
              <textarea
                className="size-lg"
                placeholder="Write something interesting about you...."
                {...register('bio')}
                defaultValue={mongoUser?.bio}
                name="bio"
              ></textarea>
              <div className="alert-text">
                Brief description for your profile. URLs are hyperlinked.
              </div>
              <ErrorMsg msg={errors.bio?.message as string} />
            </div>
          </div>

          <div className="bg-white card-box border-20 mt-40">
            <h4 className="dash-title-three">Social Media</h4>

            <div className="dash-input-wrapper mb-20">
              <label htmlFor="">LinkedIn</label>
              <input
                type="text"
                placeholder="Ex. linkedin.com/in/jamesbrower"
                {...register('mediaLinks.linkedin')}
                defaultValue={mongoUser?.mediaLinks?.linkedin}
              />
              <ErrorMsg msg={errors.mediaLinks?.message as string} />
            </div>

            <div className="dash-input-wrapper mb-20">
              <label htmlFor="">Github</label>
              <input
                type="text"
                placeholder="ex. github.com/jamesbrower"
                {...register('mediaLinks.github')}
                defaultValue={mongoUser?.mediaLinks?.github}
              />
              <ErrorMsg msg={errors.mediaLinks?.message as string} />
            </div>
            {/* <a href="#/" className="dash-btn-one">
              <i className="bi bi-plus"></i> Add more link
            </a> */}
          </div>

          <div className="bg-white card-box border-20 mt-40">
            <h4 className="dash-title-three">Address & Location</h4>
            <div className="row">
              <div className="col-12">
                <div className="dash-input-wrapper mb-25">
                  <label htmlFor="">Address*</label>
                  <input
                    type="text"
                    placeholder="Cowrasta, Chandana, Gazipur Sadar"
                    {...register('address')}
                    defaultValue={mongoUser?.address}
                    name="address"
                  />
                  <ErrorMsg msg={errors?.address?.message as string} />
                </div>
              </div>
              <div className="col-12">
                <div className=" mb-25">
                  <label className="fw-semibold mb-2" htmlFor="">
                    Country*
                  </label>
                  <Controller
                    name="country"
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
                  {errors?.country && (
                    <ErrorMsg msg={errors?.country?.message as string} />
                  )}
                </div>
              </div>
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
              {isSubmitting ? 'Updating...' : 'Update User'}
            </button>
            <button onClick={() => reset()} className="dash-cancel-btn tran3s">
              Cancel
            </button>
          </div>
        </form>
      </FormProvider>
    </>
  );
};

export default UpdateUserArea;
