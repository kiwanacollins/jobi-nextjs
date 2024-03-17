'use client';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { useForm, FormProvider, Controller } from 'react-hook-form';
import { getUserByMongoId, updateUserByAdmin } from '@/lib/actions/user.action';
import * as z from 'zod';
import { notifyError, notifySuccess } from '@/utils/toast';
import ErrorMsg from '@/app/components/common/error-msg';
import { userSchema } from '@/utils/validation';
import { zodResolver } from '@hookform/resolvers/zod';
import { IUser } from '@/database/user.model';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Country, ICountry } from 'country-state-city';
import OptionSelect from '@/app/components/common/OptionSelect';
import Select from 'react-select';
import { ICategory } from '@/database/category.model';
import { getCategories } from '@/lib/actions/admin.action';

interface ParamsProps {
  params: {
    id: string;
  };
}

const UpdateUser = ({ params }: ParamsProps) => {
  const [mongoUser, setMongoUser] = useState<IUser>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [filename, setFilename] = useState('');
  const [gender, setGender] = useState('male');
  const [imagePreview, setImagePreview] = useState<string | undefined>();
  const pathname = usePathname();
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [subCategoryOptions, setSubCategoryOptions] = useState([]);
  const [categoryOptions, setCategoryOptions] = useState([]);

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
      post: mongoUser?.post || '',
      age: mongoUser?.age,
      email: mongoUser?.email || '',
      skills: mongoUser?.skills || [],
      // salary_duration: mongoUser?.salary_duration,
      // maxSalary: mongoUser?.maxSalary,
      // minSalary: mongoUser?.minSalary,
      qualification: mongoUser?.qualification,
      bio: mongoUser?.bio,
      mediaLinks: {
        linkedin: mongoUser?.mediaLinks?.linkedin || '',
        github: mongoUser?.mediaLinks?.github || ''
      },
      address: mongoUser?.address || '',
      country: mongoUser?.country || ''
    }
  });

  const {
    register,
    reset,
    setValue,
    control,
    handleSubmit,
    watch,
    formState: { errors }
  } = methods;

  const selectedPost = watch('post');
  const skillsOfSelectedPost = categories.find(
    (cat: any) => cat?.name === selectedPost
  );

  const selectedPostSkills = skillsOfSelectedPost?.subcategory?.map(
    (item: any) => ({
      value: item.name,
      label: item.name
    })
  );

  useEffect(() => {
    const fetchCategories = async () => {
      const res = await getCategories();
      setCategories(res);
      const categoriesData = res?.map((item: any) => ({
        value: item.name,
        label: item.name
      }));
      setCategoryOptions(categoriesData);
      const subcategories = res.flatMap((item: any) =>
        item.subcategory.map((i: any) => i.name)
      );
      const uniqueSubcategories = [...new Set(subcategories)];
      const subCategoryData = uniqueSubcategories.map((item: any) => ({
        value: item as string,
        label: item as string
      }));
      // @ts-ignore
      setSubCategoryOptions(subCategoryData);
    };
    fetchCategories();
  }, []);

  // fetchUser by id
  useEffect(() => {
    const fetchUserById = async () => {
      try {
        const user = await getUserByMongoId({ id: params.id });
        setMongoUser(user);
        setGender(user?.gender);
        reset(user);
      } catch (error: any) {
        notifyError(error as string);
      }
    };
    fetchUserById();
  }, [params.id, reset]);

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
          setValue('picture', pdfFile.result as string);
        }
      };

      pdfFile.onloadend = () => {
        setImagePreview(pdfFile.result as string | undefined);
      };
    }
    pdfFile.readAsDataURL(event.target.files?.[0] as File);
  };

  const handleGenderChange = (event: any) => {
    setGender(event.target.value);
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
    console.log(value);
    try {
      await updateUserByAdmin({
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
      setProgress(100);
      notifySuccess('User Updated Successfully');
    } catch (error: any) {
      notifyError(error.message as string);
    } finally {
      setIsSubmitting(false);
      setProgress(0);
    }
  };

  return (
    <>
      <h2 className="main-title">Create User</h2>
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="bg-white card-box border-20">
            <div className="user-avatar-setting d-flex align-items-center mb-30">
              {(imagePreview || mongoUser?.picture) && (
                <Image
                  //@ts-ignore
                  src={imagePreview || mongoUser?.picture}
                  alt="avatar"
                  height={80}
                  width={80}
                  className="lazy-img user-img"
                />
              )}

              <div className="upload-btn position-relative tran3s ms-4 me-3">
                <small>{filename || ' Upload new photo'}</small>

                <input
                  type="file"
                  id="uploadImg"
                  name="file"
                  accept="image/*"
                  placeholder="Upload new photo"
                  defaultValue={mongoUser?.picture}
                  onChange={(e) => handleFileChange(e)}
                />
              </div>
              <button className="delete-btn tran3s">Delete</button>
            </div>

            <div>
              {mongoUser?._id && (
                <Link
                  href={`/dashboard/admin-dashboard/candidate/addresume/${mongoUser._id}`}
                  className="btn btn-primary mb-3"
                >
                  {mongoUser?.resumeId ? 'Update Resume' : 'Add Resume'}
                </Link>
              )}
            </div>

            <div className="dash-input-wrapper mb-30">
              <label htmlFor="">Full Name*</label>
              <input
                type="text"
                placeholder="You fullname"
                defaultValue={mongoUser?.name}
                {...register('name')}
                name="name"
              />
              <ErrorMsg msg={errors?.name?.message as string} />
            </div>

            <div className="dash-input-wrapper mb-30">
              <label htmlFor="">Email*</label>
              <input
                type="email"
                placeholder="Your email address"
                {...register('email', { required: true })}
                defaultValue={mongoUser?.email}
                name="email"
              />
              <ErrorMsg msg={errors?.email?.message as string} />
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
              <label className="mb-20 ">Gender</label>
              <div>
                <div>
                  <input
                    {...register('gender', { required: true })}
                    type="radio"
                    id="male"
                    value="male"
                    className="me-2"
                    checked={gender === 'male'}
                    onChange={handleGenderChange}
                  />
                  <label htmlFor="male">Male</label>
                </div>

                <div>
                  <input
                    {...register('gender', { required: true })}
                    type="radio"
                    id="female"
                    className="me-2"
                    value="female"
                    checked={gender === 'female'}
                    onChange={handleGenderChange}
                  />
                  <label htmlFor="female">Female</label>
                </div>
              </div>
              {errors?.gender && (
                <ErrorMsg msg={errors?.gender?.message as string} />
              )}
            </div>
            {/* Gender end */}
            {/* Qualification Start */}
            <div className="dash-input-wrapper mb-25">
              <label htmlFor="">Qualification*</label>
              <OptionSelect
                register={register}
                name="qualification"
                options={[
                  { value: `master's degree`, label: `Master's Degree` },
                  { value: `bachelor degree`, label: `Bachelor Degree` },
                  { value: `Higher Secondary`, label: `Higher Secondary` },
                  { value: `Secondary School`, label: `Secondary School` }
                ]}
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
                      selectedPost
                        ? selectedPostSkills
                        : subCategoryOptions || []
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

            <div className="dash-input-wrapper mb-30">
              <label htmlFor="">Experience*</label>
              <OptionSelect
                register={register}
                name="experience"
                options={[
                  { value: 'Intermediate', label: 'Intermediate' },
                  { value: 'No-Experience', label: 'No-Experience' },
                  { value: 'Expert', label: 'Expert' }
                ]}
              />

              {errors?.experience && (
                <ErrorMsg msg={errors?.experience?.message as string} />
              )}
            </div>

            {/* Experience end */}

            {/* Salary start */}
            {/* <div className="row">
              <div className="col-md-6">
                <div className="dash-input-wrapper">
                  <label htmlFor="">Salary*</label>
                  <SalaryDurationSelect register={register} />
                  {errors?.salary_duration && (
                    <ErrorMsg msg={errors?.salary_duration.message} />
                  )}
                </div>
              </div>
              <div className="col-md-3">
                <div className="dash-input-wrapper">
                  <input
                    type="text"
                    defaultValue={mongoUser?.minSalary || ''}
                    placeholder="Min Salary"
                    {...register('minSalary', { valueAsNumber: true })}
                    name="minSalary"
                  />
                  {errors?.minSalary && (
                    <ErrorMsg msg={errors?.minSalary.message} />
                  )}
                </div>
              </div>
              <div className="col-md-3">
                <div className="dash-input-wrapper">
                  <input
                    type="text"
                    defaultValue={mongoUser?.maxSalary || ''}
                    placeholder="Max salary"
                    {...register('maxSalary', { valueAsNumber: true })}
                    name="maxSalary"
                  />
                  {errors?.maxSalary && (
                    <ErrorMsg msg={errors?.maxSalary.message} />
                  )}
                </div>
              </div>
            </div> */}
            {/* Salary end */}
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

export default UpdateUser;
