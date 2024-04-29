'use client';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import CountrySelect from './country-select';
import CitySelect from './city-select';
import { useForm, FormProvider, Resolver } from 'react-hook-form';
import { updateUser } from '@/lib/actions/user.action';
import { usePathname } from 'next/navigation';
import { IUser } from '@/database/user.model';
import ErrorMsg from '../../common/error-msg';
import { notifyError, notifySuccess } from '@/utils/toast';
import QualicationSelect from './QualicationSelect';
import { Country } from 'country-state-city';

// props type
type IProps = {
  userId: string;
  mongoUser: IUser | null;
};
const DashboardProfileArea = ({ mongoUser, userId }: IProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const pathname = usePathname();
  const [filename, setFilename] = useState('');
  const [gender, setGender] = useState(mongoUser?.gender || 'male');
  const [selectedCountryDetails, setSelectedCountryDetails] = useState(
    {} as any
  );

  // resolver
  const resolver: Resolver = async (values) => {
    return {
      values: values.name ? values : '',
      defaultValues: {
        name: mongoUser?.name || '',
        age: mongoUser?.age || '',
        phone: mongoUser?.phone || '',
        qualification: mongoUser?.qualification || '',
        bio: mongoUser?.bio || '',
        minSalary: mongoUser?.minSalary || '',
        maxSalary: mongoUser?.maxSalary || '',
        mediaLinks: mongoUser?.mediaLinks,
        address: mongoUser?.address || '',
        country: mongoUser?.country || ''
      },
      errors: !values.name
        ? {
            name: {
              type: 'required',
              message: 'Name is required'
            },
            bio: {
              type: 'required',
              message: 'Bio is required'
            },
            address: {
              type: 'required',
              message: 'Address is required'
            },
            mediaLinks: {
              linkedin: {
                type: 'required',
                message: 'Linkedin is required'
              },
              github: {
                type: 'required',
                message: 'Github is required'
              }
            },
            country: {
              type: 'required',
              message: 'Country is required'
            }
          }
        : {}
    };
  };

  const methods = useForm({ resolver });

  const {
    register,
    reset,
    setValue,
    watch,
    handleSubmit,
    formState: { errors }
  } = methods;
  const selectedCountryName = watch('country');

  useEffect(() => {
    const selectedCountry = Country.getAllCountries().find(
      (country) => country.name === selectedCountryName
    );
    setSelectedCountryDetails(selectedCountry);
  }, [selectedCountryName]);

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
    }
    pdfFile.readAsDataURL(event.target.files?.[0] as File);
  };

  const handleGenderChange = (event: any) => {
    setGender(event.target.value);
  };

  const onSubmit = async (value: any) => {
    setIsSubmitting(true);
    console.log(value);
    try {
      await updateUser({
        clerkId: userId,
        updateData: {
          name: value?.name,
          bio: value.bio,
          phone: value.phone,
          age: value.age,
          picture: value.picture,
          gender: value.gender,
          qualification: value.qualification,
          minSalary: value.minSalary,
          maxSalary: value.maxSalary,
          mediaLinks: value.mediaLinks,
          address: value.address,
          country: value.country,
          city: value.city,
          zip: value.zip
        },
        path: pathname
      });
      notifySuccess('Profile Updated Successfully');
    } catch (error: any) {
      notifyError(error as string);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <h2 className="main-title">My Profile</h2>
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="bg-white card-box border-20">
            <div className="user-avatar-setting d-flex align-items-center mb-30">
              {mongoUser?.picture && (
                <Image
                  src={mongoUser?.picture as string}
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
                  onChange={(e) => handleFileChange(e)}
                />
              </div>
              <button className="delete-btn tran3s">Delete</button>
            </div>
            <div className="dash-input-wrapper mb-30">
              <label htmlFor="">Full Name*</label>
              <input
                defaultValue={mongoUser?.name}
                type="text"
                placeholder="You name"
                {...register('name')}
                name="name"
              />
              <ErrorMsg msg={errors?.name?.message as string} />
            </div>

            <div className="dash-input-wrapper mb-30">
              <label htmlFor="">Phone</label>
              <input
                defaultValue={mongoUser?.phone}
                type="text"
                placeholder="017xxxxxxxxx"
                {...register('phone')}
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
                defaultValue={mongoUser?.age || ''}
                type="text"
                placeholder="your age"
                {...register('age', { valueAsNumber: true })}
                name="age"
              />
              <ErrorMsg msg={errors?.age?.message as string} />
            </div>
            {/* age end */}
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
            {/* Qualification Start */}
            <div className="dash-input-wrapper mb-25">
              <label htmlFor="">Qualification*</label>
              <QualicationSelect setValue={setValue} />
            </div>
            {/* Qualification End */}

            {/* Salary start */}
            <div className="d-flex align-items-center mb-3 mt-30">
              <label htmlFor="salaryStart" className="form-label me-4">
                Salary Range *
              </label>
              <div className="d-flex dash-input-wrapper gap-3">
                <input
                  type="text"
                  defaultValue={mongoUser?.minSalary}
                  placeholder="min salary"
                  {...register('minSalary', {
                    valueAsNumber: true
                  })}
                  name="minSalary"
                />
                {errors?.minSalary && (
                  <ErrorMsg msg={errors?.minSalary?.message as string} />
                )}
                <input
                  type="text"
                  defaultValue={mongoUser?.maxSalary}
                  placeholder="max salary"
                  {...register('maxSalary', {
                    valueAsNumber: true
                  })}
                  name="maxSalary"
                />
                {errors?.maxSalary?.message && (
                  <ErrorMsg msg={errors?.maxSalary?.message as string} />
                )}
              </div>
            </div>
            {/* Salary end */}
            <div className="dash-input-wrapper">
              <label htmlFor="">Bio*</label>
              <textarea
                className="size-lg"
                placeholder="Write something interesting about you...."
                defaultValue={mongoUser?.bio}
                {...register('bio')}
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
                defaultValue={mongoUser?.mediaLinks?.linkedin}
                placeholder="Ex. linkedin.com/in/jamesbrower"
                {...register('mediaLinks.linkedin')}
              />
              <ErrorMsg msg={errors.mediaLinks?.message as string} />
            </div>

            <div className="dash-input-wrapper mb-20">
              <label htmlFor="">Github</label>
              <input
                type="text"
                defaultValue={mongoUser?.mediaLinks?.github}
                placeholder="ex. github.com/jamesbrower"
                {...register('mediaLinks.github')}
              />
              <ErrorMsg msg={errors.mediaLinks?.message as string} />
            </div>
            <a href="#/" className="dash-btn-one">
              <i className="bi bi-plus"></i> Add more link
            </a>
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
                    defaultValue={mongoUser?.address}
                    {...register('address')}
                    name="address"
                  />
                  <ErrorMsg msg={errors?.address?.message as string} />
                </div>
              </div>
              <div className="col-lg-3">
                <div className="dash-input-wrapper mb-25">
                  <label htmlFor="">Country*</label>
                  <CountrySelect register={register} />
                </div>
              </div>
              <div className="col-lg-3">
                <div className="dash-input-wrapper mb-25">
                  <label htmlFor="">City*</label>
                  <CitySelect
                    register={register}
                    countryCode={selectedCountryDetails?.isoCode || ''}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="button-group d-inline-flex align-items-center mt-30">
            <button
              disabled={isSubmitting}
              type="submit"
              className="dash-btn-two tran3s me-3"
            >
              {isSubmitting ? 'Saving...' : 'Save'}
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

export default DashboardProfileArea;
