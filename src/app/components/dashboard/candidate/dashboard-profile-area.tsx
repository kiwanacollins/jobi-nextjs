'use client';
import React, { useState } from 'react';
import Image from 'next/image';
import search from '@/assets/dashboard/images/icon/icon_16.svg';
import CountrySelect from './country-select';
import CitySelect from './city-select';
import StateSelect from './state-select';
import { useForm, FormProvider, Resolver } from 'react-hook-form';
import { updateUser } from '@/lib/actions/user.action';
import { usePathname } from 'next/navigation';
import { IUser } from '@/database/user.model';
import ErrorMsg from '../../common/error-msg';
import { notifyError, notifySuccess } from '@/utils/toast';
import QualicationSelect from './QualicationSelect';

// props type
type IProps = {
  userId: string;
  mongoUser: IUser | null;
};
const DashboardProfileArea = ({ mongoUser, userId }: IProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const pathname = usePathname();
  // resolver
  const resolver: Resolver = async (values) => {
    return {
      values: values.name ? values : '',
      defaultValues: {
        name: mongoUser?.name || '',
        username: mongoUser?.username || '  ',
        age: mongoUser?.age || '',
        phone: mongoUser?.phone || '',
        qualification: mongoUser?.qualification || '',
        bio: mongoUser?.bio || '',
        mediaLinks: mongoUser?.mediaLinks,
        address: mongoUser?.address || '',
        country: mongoUser?.country || '',
        city: mongoUser?.city || '',
        zip: mongoUser?.zip || '',
        state: mongoUser?.state || '',
        mapLocation: mongoUser?.mapLocation || '',
        location: mongoUser?.location || ''
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
    setValue,
    handleSubmit,
    formState: { errors }
  } = methods;

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
          gender: value.gender,
          qualification: value.qualification,
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
                {...register('name')}
                name="name"
              />
              <ErrorMsg msg={errors?.name?.message as string} />
            </div>
            <div className="dash-input-wrapper mb-30">
              <label htmlFor="">username</label>
              <input
                defaultValue={mongoUser?.username}
                type="text"
                placeholder="username"
                {...register('username')}
                name="username"
              />
              <ErrorMsg msg={errors?.username?.message as string} />
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
                    defaultChecked
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
                  />
                  <label htmlFor="female">Female</label>
                </div>
                <div>
                  <input
                    {...register('gender', { required: true })}
                    type="radio"
                    id="thirdGender"
                    className="me-2"
                    value="thirdGender"
                  />
                  <label htmlFor="thirdGender">Third Gender</label>
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
                  <CountrySelect setValue={setValue} />
                </div>
              </div>
              <div className="col-lg-3">
                <div className="dash-input-wrapper mb-25">
                  <label htmlFor="">City*</label>
                  <CitySelect setValue={setValue} />
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
                  <StateSelect setValue={setValue} />
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
                    <ErrorMsg msg={errors?.mapLocation?.message as string} />
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
