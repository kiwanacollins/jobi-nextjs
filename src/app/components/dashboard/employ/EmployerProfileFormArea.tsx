'use client';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import avatar from '@/assets/dashboard/images/avatar_04.jpg';
import { Controller, useForm } from 'react-hook-form';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { employeeProfileSchema } from '@/utils/validation';
import { Country, ICountry } from 'country-state-city';
import { createEmployeeProfileByUpdating } from '@/lib/actions/employee.action';
import { usePathname, useRouter } from 'next/navigation';
import { IServerResponse } from '@/types';
import { notifyError, notifySuccess } from '@/utils/toast';
import Select from 'react-select';
import { getCategories } from '@/lib/actions/admin.action';
import ErrorMsg from '../../common/error-msg';
import { IUser } from '@/database/user.model';

interface IEmployerProfileFormAreaProps {
  mongoUser: IUser;
}

const EmployerProfileFormArea = ({
  mongoUser
}: IEmployerProfileFormAreaProps) => {
  const pathname = usePathname();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [categoryOptions, setCategoryOptions] = useState<any>([]);
  const countries: ICountry[] = Country.getAllCountries();
  const countryOptions = countries.map((country) => ({
    value: country.name,
    label: country.name
  }));

  type employeeProfileType = z.infer<typeof employeeProfileSchema>;

  const methods = useForm<employeeProfileType>({
    resolver: zodResolver(employeeProfileSchema),
    defaultValues: {
      name: mongoUser?.name || '',
      email: mongoUser?.email || '',
      companyName: mongoUser?.companyName || '',
      website: mongoUser?.website || '',
      bio: mongoUser?.bio || '',
      categories: mongoUser?.categories || [],
      phone: mongoUser?.phone || '',
      mediaLinks: {
        linkedin: mongoUser?.mediaLinks?.linkedin || '',
        github: mongoUser?.mediaLinks?.github || ''
      },

      address: mongoUser?.address || '',
      country: mongoUser?.country || ''
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
      const categoriesData = res?.map((item: any) => ({
        value: item.name,
        label: item.name
      }));
      setCategoryOptions(categoriesData);
    };
    fetchCategories();
  }, []);

  const onSubmit = async (value: any) => {
    setIsSubmitting(true);
    const updateData = {
      name: value.name,
      email: value.email,
      companyName: value.companyName,
      website: value.website,
      bio: value.bio,
      categories: value.categories,
      phone: value.phone,
      mediaLinks: {
        linkedin: value.mediaLinks.linkedin,
        github: value.mediaLinks.github
      },
      address: value.address,
      country: value.country
    };

    try {
      const response: IServerResponse = await createEmployeeProfileByUpdating({
        clerkId: mongoUser?.clerkId,
        updateData,
        path: pathname
      });

      if (response.status === 'ok') {
        notifySuccess('Employee profile created successfully');
        if (pathname === '/createProfile') {
          router.push('/');
        }
      }
    } catch (error) {
      console.log('error', error);
      notifyError('Failed to create employee profile');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section>
      <div>
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
            <div className="dash-input-wrapper mb-30">
              <label htmlFor="">Company Name*</label>
              <input
                type="text"
                defaultValue={mongoUser?.companyName || ''}
                placeholder="Your Company Name"
                {...register('companyName')}
                name="companyName"
              />
              {errors?.companyName && (
                <ErrorMsg msg={errors?.companyName?.message as string} />
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
                    placeholder="Enter your website URL"
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
                  <label htmlFor="">Phone Number*</label>
                  <input
                    type="tel"
                    {...register('phone')}
                    name="phone"
                    placeholder="Your phone number"
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
                        options={categoryOptions || []}
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
              {errors?.bio && <ErrorMsg msg={errors?.bio?.message as string} />}
              <div className="alert-text">
                Brief description for your company. URLs are hyperlinked.
              </div>
            </div>
          </div>

          <div className="bg-white card-box border-20 mt-40">
            <h4 className="dash-title-three">Social Media</h4>
            <div className="dash-input-wrapper mb-20">
              <label htmlFor="">LinkedIn</label>
              <Controller
                name="mediaLinks.linkedin"
                control={control}
                defaultValue={mongoUser?.mediaLinks?.linkedin || ''}
                render={({ field }) => (
                  <input
                    {...field}
                    type="text"
                    placeholder="Enter LinkedIn Profile Url"
                  />
                )}
              />
              {errors?.mediaLinks?.linkedin && (
                <ErrorMsg
                  msg={errors?.mediaLinks?.linkedin?.message as string}
                />
              )}
            </div>
            <div className="dash-input-wrapper mb-20">
              <label htmlFor="">Github</label>
              <Controller
                name="mediaLinks.github"
                control={control}
                defaultValue={mongoUser?.mediaLinks?.github || ''}
                render={({ field }) => (
                  <input
                    {...field}
                    type="text"
                    placeholder="Enter Github Profile Url"
                  />
                )}
              />
              {errors?.mediaLinks?.github && (
                <ErrorMsg msg={errors?.mediaLinks?.github?.message as string} />
              )}
            </div>
            {/* <button className="dash-btn-one">
                <i className="bi bi-plus"></i> Add more link
              </button> */}
          </div>

          <div className="bg-white card-box border-20 mt-40">
            <h4 className="dash-title-three">Address & Location</h4>
            <div className="row">
              <div className="col-12">
                <div className="dash-input-wrapper mb-25">
                  <label htmlFor="">Address*</label>
                  <input
                    type="text"
                    placeholder="City, State, Zip Code"
                    defaultValue={mongoUser?.address}
                    {...register('address')}
                    name="address"
                  />
                  {errors?.address && (
                    <ErrorMsg msg={errors?.address?.message as string} />
                  )}
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
      </div>
    </section>
  );
};
export default EmployerProfileFormArea;
