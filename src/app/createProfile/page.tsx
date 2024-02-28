'use client';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import avatar from '@/assets/dashboard/images/avatar_04.jpg';
import { Controller, useForm } from 'react-hook-form';
import CitySelect from '../components/dashboard/candidate/city-select';
import CountrySelect from '../components/dashboard/candidate/country-select';
import { useAuth } from '@clerk/nextjs';
import { getUserById } from '@/lib/actions/user.action';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { employeeProfileSchema } from '@/utils/validation';
import ErrorMsg from '../components/common/error-msg';
import { Country } from 'country-state-city';
import { createEmployeeProfileByUpdating } from '@/lib/actions/employee.action';
import { usePathname, useRouter } from 'next/navigation';
import { IServerResponse } from '@/types';
import { notifyError, notifySuccess } from '@/utils/toast';
import { skills } from '@/constants';
import Select from 'react-select';

const Page = () => {
  const { userId } = useAuth();
  const [mongoUser, setMongoUser] = useState({} as any);
  const pathname = usePathname();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [selectedCountryDetails, setSelectedCountryDetails] = useState(
    {} as any
  );

  type employeeProfileType = z.infer<typeof employeeProfileSchema>;

  const methods = useForm<employeeProfileType>({
    resolver: zodResolver(employeeProfileSchema),
    defaultValues: {
      name: mongoUser?.name || '',
      email: mongoUser?.email || '',
      website: mongoUser?.website || '',
      companySize: mongoUser?.companySize || 0,
      bio: mongoUser?.bio || '',
      categories: mongoUser?.categories || [],
      phone: mongoUser?.phone || '',
      mediaLinks: {
        linkedin: '',
        github: ''
      },
      established: mongoUser?.established || '',
      address: mongoUser?.address || '',
      country: mongoUser?.country || '',
      city: mongoUser?.city || '',
      street: mongoUser?.street || '',
      zip: mongoUser?.zip || ''
    }
  });
  const {
    handleSubmit,
    register,
    reset,
    watch,
    control,
    formState: { errors }
  } = methods;

  console.log('validation errors', errors);

  const selectedCountryName = watch('country');

  useEffect(() => {
    const selectedCountry = Country.getAllCountries().find(
      (country) => country.name === selectedCountryName
    );
    setSelectedCountryDetails(selectedCountry);
  }, [selectedCountryName]);

  useEffect(() => {
    const fetchUser = async () => {
      const user = await getUserById({ userId });
      setMongoUser(user);
      reset(user);
    };
    fetchUser();
  }, [userId, reset]);

  const onSubmit = async (value: any) => {
    setIsSubmitting(true);
    const updateData = {
      name: value.name,
      email: value.email,
      website: value.website,
      companySize: value.companySize,
      bio: value.bio,
      categories: value.categories,
      phone: value.phone,
      mediaLinks: {
        linkedin: value.mediaLinks.linkedin,
        github: value.mediaLinks.github
      },
      established: value.established,
      address: value.address,
      country: value.country,
      city: value.city,
      zip: value.zip
    };

    try {
      const response: IServerResponse = await createEmployeeProfileByUpdating({
        clerkId: userId,
        updateData,
        path: pathname
      });
      console.log('response', response);

      if (response.status === 'ok') {
        notifySuccess('Employee profile created successfully');
        router.push('/');
      }
    } catch (error) {
      console.log('error', error);
      notifyError('Failed to create employee profile');
    } finally {
      setIsSubmitting(false);
    }
  };

  const options = mongoUser?.categories?.map((skill: string) => ({
    value: skill,
    label: skill
  }));
  const skillsOptions = skills.map((skill) => ({
    value: skill,
    label: skill
  }));

  return (
    <div className="">
      <section className="d-flex container align-items-center justify-content-center ">
        <div className="dashboard-body">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="bg-white card-box border-20">
              <div className="user-avatar-setting d-flex align-items-center mb-30">
                <Image
                  src={mongoUser?.picture || avatar}
                  alt="avatar"
                  width={130}
                  height={130}
                  className="lazy-img user-img"
                />
              </div>
              <div className="dash-input-wrapper mb-30">
                <label htmlFor="">Employer Name*</label>
                <input
                  type="text"
                  defaultValue={mongoUser?.name || ''}
                  placeholder="Your name"
                  {...register('name')}
                  name="name"
                />
                {errors?.name && (
                  <ErrorMsg msg={errors?.name?.message as string} />
                )}
              </div>
              <div className="row">
                <div className="col-md-6">
                  <div className="dash-input-wrapper mb-30">
                    <label htmlFor="">Email*</label>
                    <input
                      type="email"
                      defaultValue={mongoUser?.email || ''}
                      readOnly
                      disabled
                      {...register('email')}
                      name="email"
                      placeholder="companyinc@gmail.com"
                    />
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="dash-input-wrapper mb-30">
                    <label htmlFor="">Website*</label>
                    <input
                      type="text"
                      defaultValue={mongoUser?.website || ''}
                      placeholder="http://somename.come"
                      {...register('website')}
                      name="website"
                    />
                    {errors?.website && (
                      <ErrorMsg msg={errors?.website?.message as string} />
                    )}
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="dash-input-wrapper mb-30">
                    <label htmlFor="">Founded Date*</label>
                    <input
                      type="date"
                      defaultValue={mongoUser?.established || ''}
                      {...register('established')}
                      name="established"
                    />
                    {errors?.established && (
                      <ErrorMsg msg={errors?.established?.message as string} />
                    )}
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="dash-input-wrapper mb-30">
                    <label htmlFor="">Company Size*</label>
                    <input
                      type="number"
                      placeholder="Numbers of employee"
                      {...register('companySize', { valueAsNumber: true })}
                      name="companySize"
                    />
                    {errors?.companySize && (
                      <ErrorMsg msg={errors?.companySize?.message as string} />
                    )}
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="dash-input-wrapper mb-30">
                    <label htmlFor="">Phone Number*</label>
                    <input
                      type="tel"
                      {...register('phone')}
                      name="phone"
                      placeholder="+880 01723801729"
                    />
                    {errors?.phone && (
                      <ErrorMsg msg={errors?.phone?.message as string} />
                    )}
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="dash-input-wrapper mb-30">
                    <label htmlFor="">Category*</label>
                    <Controller
                      name="categories"
                      control={control}
                      render={({ field }) => (
                        <Select
                          isMulti
                          {...field}
                          //@ts-ignore
                          defaultValue={options}
                          options={skillsOptions || []}
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
                    {errors?.categories && (
                      <ErrorMsg msg={errors?.categories?.message as string} />
                    )}
                  </div>
                </div>
              </div>
              <div className="dash-input-wrapper">
                <label htmlFor="">About Company*</label>
                <textarea
                  className="size-lg"
                  placeholder="Write something interesting about you...."
                  {...register('bio')}
                  name="bio"
                ></textarea>
                {errors?.bio && (
                  <ErrorMsg msg={errors?.bio?.message as string} />
                )}
                <div className="alert-text">
                  Brief description for your company. URLs are hyperlinked.
                </div>
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
                {errors?.mediaLinks?.linkedin && (
                  <ErrorMsg
                    msg={errors?.mediaLinks?.linkedin?.message as string}
                  />
                )}
              </div>
              <div className="dash-input-wrapper mb-20">
                <label htmlFor="">Github</label>
                <input
                  type="text"
                  defaultValue={mongoUser?.mediaLinks?.github}
                  placeholder="ex. github.com/jamesbrower"
                  {...register('mediaLinks.github')}
                />
                {errors?.mediaLinks?.github && (
                  <ErrorMsg
                    msg={errors?.mediaLinks?.github?.message as string}
                  />
                )}
              </div>
              <button className="dash-btn-one">
                <i className="bi bi-plus"></i> Add more link
              </button>
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
                    {errors?.address && (
                      <ErrorMsg msg={errors?.address?.message as string} />
                    )}
                  </div>
                </div>
                <div className="col-lg-4">
                  <div className="dash-input-wrapper mb-25">
                    <label htmlFor="">Country*</label>
                    <CountrySelect register={register} />
                    {errors?.country && (
                      <ErrorMsg msg={errors?.country?.message as string} />
                    )}
                  </div>
                </div>
                <div className="col-lg-4">
                  <div className="dash-input-wrapper mb-25">
                    <label htmlFor="">City*</label>
                    <CitySelect
                      register={register}
                      countryCode={selectedCountryDetails?.isoCode || ''}
                    />
                    {errors?.city && (
                      <ErrorMsg msg={errors?.city?.message as string} />
                    )}
                  </div>
                </div>
                <div className="col-lg-4">
                  <div className="dash-input-wrapper mb-25">
                    <label htmlFor="">Zip Code*</label>
                    <input
                      type="text"
                      {...register('zip')}
                      placeholder="1708"
                      defaultValue={mongoUser?.zip}
                      className="form-control"
                      name="zip"
                    />
                    {errors?.zip && (
                      <ErrorMsg msg={errors?.zip?.message as string} />
                    )}
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
              <button
                onClick={() => reset()}
                className="dash-cancel-btn tran3s"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
};
export default Page;
