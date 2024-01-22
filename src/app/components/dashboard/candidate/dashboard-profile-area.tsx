'use client';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import search from '@/assets/dashboard/images/icon/icon_16.svg';
import DashboardHeader from './dashboard-header';
import CountrySelect from './country-select';
import CitySelect from './city-select';
import StateSelect from './state-select';
import { useForm, FormProvider, Resolver } from 'react-hook-form';
import { useAuth } from '@clerk/nextjs';
import { getUserById, updateUser } from '@/lib/actions/user.action';
import { redirect, usePathname } from 'next/navigation';
import { IUser } from '@/database/user.model';

import ErrorMsg from '../../common/error-msg';

import { notifyError, notifySuccess } from '@/utils/toast';

// props type
type IProps = {
  setIsOpenSidebar: React.Dispatch<React.SetStateAction<boolean>>;
};
const DashboardProfileArea = ({ setIsOpenSidebar }: IProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { userId } = useAuth();
  const pathname = usePathname();
  const [mongoUser, setMongoUser] = useState<IUser>();

  if (!userId) redirect('/sign-in');

  // resolver
  const resolver: Resolver<IUser> = async (values) => {
    return {
      values: values.name ? values : {},
      defaultValues: {
        name: mongoUser?.name,
        username: mongoUser?.username,
        bio: mongoUser?.bio,
        mediaLinks: mongoUser?.mediaLinks,
        address: mongoUser?.address,
        country: mongoUser?.country,
        city: mongoUser?.city,
        zip: mongoUser?.zip,
        state: mongoUser?.state,
        mapLocation: mongoUser?.mapLocation,
        location: mongoUser?.location
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
            },
            city: {
              type: 'required',
              message: 'City is required'
            },
            zip: {
              type: 'required',
              message: 'Zip is required'
            },
            state: {
              type: 'required',
              message: 'State is required'
            }
          }
        : {}
    };
  };

  const methods = useForm({ resolver });

  const {
    register,
    reset,
    handleSubmit,
    formState: { errors }
  } = methods;

  useEffect(() => {
    getUserById({ userId })
      .then((user) => {
        setMongoUser(user);
        reset(user);
      })
      .catch((error) => {
        throw new Error(error.message);
      });
  }, [userId, reset]);

  const onSubmit = async (value: any) => {
    setIsSubmitting(true);
    try {
      console.log(value);
      await updateUser({
        clerkId: userId,
        updateData: {
          name: value?.name,
          bio: value.bio,
          mediaLinks: value.mediaLinks,
          address: value.address,
          country: value.country,
          city: value.city,
          zip: value.zip,
          state: value.state,
          mapLocation: value.mapLocation,
          location: value.location
        },
        path: pathname
      });
      notifySuccess('Profile updated successfully');
    } catch (error: any) {
      notifyError(error as string);
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <div className="dashboard-body">
      <div className="position-relative">
        {/* header start */}
        <DashboardHeader setIsOpenSidebar={setIsOpenSidebar} />
        {/* header end */}

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
                  Upload new photo
                  <input
                    type="file"
                    id="uploadImg"
                    name="uploadImg"
                    placeholder=""
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
                  {...(register('name') as const)}
                  name="name"
                />
                <ErrorMsg msg={errors?.name?.message} />
              </div>
              <div className="dash-input-wrapper mb-30">
                <label htmlFor="">username</label>
                <input
                  defaultValue={mongoUser?.username}
                  type="text"
                  placeholder="Karim Uddin"
                  {...register('username')}
                  name="username"
                />
                <ErrorMsg msg={errors?.username?.message} />
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
                <ErrorMsg msg={errors.bio?.message} />
              </div>
            </div>

            <div className="bg-white card-box border-20 mt-40">
              <h4 className="dash-title-three">Social Media</h4>

              <div className="dash-input-wrapper mb-20">
                <label htmlFor="">LinkedIn</label>
                <input
                  type="text"
                  defaultValue={mongoUser?.mediaLinks?.linkedin}
                  placeholder="ex. linkedin.com/in/jamesbrower"
                  {...register('mediaLinks.linkedin')}
                />
                <ErrorMsg msg={errors.mediaLinks?.linkedin?.message} />
              </div>

              <div className="dash-input-wrapper mb-20">
                <label htmlFor="">Github</label>
                <input
                  type="text"
                  defaultValue={mongoUser?.mediaLinks?.github}
                  placeholder="ex. github.com/jamesbrower"
                  {...register('mediaLinks.github')}
                />
                <ErrorMsg msg={errors.mediaLinks?.github?.message} />
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
                      {...register('address')}
                      defaultValue={mongoUser?.address}
                      name="address"
                    />
                    <ErrorMsg msg={errors?.address?.message} />
                  </div>
                </div>
                <div className="col-lg-3">
                  <div className="dash-input-wrapper mb-25">
                    <label htmlFor="">Country*</label>
                    <CountrySelect />
                  </div>
                </div>
                <div className="col-lg-3">
                  <div className="dash-input-wrapper mb-25">
                    <label htmlFor="">City*</label>
                    <CitySelect />
                  </div>
                </div>
                <div className="col-lg-3">
                  <div className="dash-input-wrapper mb-25">
                    <label htmlFor="">Zip Code*</label>
                    <input
                      type="text"
                      {...register('zip')}
                      placeholder="1708"
                      defaultValue={mongoUser?.zip}
                      name="zip"
                    />
                  </div>
                </div>
                <div className="col-lg-3">
                  <div className="dash-input-wrapper mb-25">
                    <label htmlFor="">State*</label>
                    <StateSelect />
                  </div>
                </div>
                <div className="col-12">
                  <div className="dash-input-wrapper mb-25">
                    <label htmlFor="">Map Location*</label>
                    <div className="position-relative">
                      <input
                        type="text"
                        placeholder="XC23+6XC, Moiran, N105"
                        {...register('mapLocation')}
                        defaultValue={mongoUser?.mapLocation}
                        name="mapLocation"
                      />
                      <ErrorMsg msg={errors?.mapLocation?.message} />
                      <button className="location-pin tran3s">
                        <Image
                          src={search}
                          alt="icon"
                          className="lazy-img m-auto"
                        />
                      </button>
                    </div>
                    <div className="map-frame mt-30">
                      <div className="gmap_canvas h-100 w-100">
                        <iframe
                          className="gmap_iframe h-100 w-100"
                          src="https://maps.google.com/maps?width=600&amp;height=400&amp;hl=en&amp;q=bass hill plaza medical centre&amp;t=&amp;z=12&amp;ie=UTF8&amp;iwloc=B&amp;output=embed"
                        ></iframe>
                      </div>
                    </div>
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
        </FormProvider>
      </div>
    </div>
  );
};

export default DashboardProfileArea;
