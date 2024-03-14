'use client';
import ErrorMsg from '@/app/components/common/error-msg';
import { createCategory } from '@/lib/actions/admin.action';
import { notifyError, notifySuccess } from '@/utils/toast';
import { categorySchema } from '@/utils/validation';
import { zodResolver } from '@hookform/resolvers/zod';
import { usePathname } from 'next/navigation';
import React, { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';

interface IProps {
  type: string;
}

const CategoryForm = ({ type }: IProps) => {
  const [skillsTag, setSkillsTag] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const pathname = usePathname();

  type ICategoryType = z.infer<typeof categorySchema>;
  // react hook form
  const methods = useForm<ICategoryType>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: '',
      subcategory: []
    }
  });

  const {
    handleSubmit,
    control,
    watch,
    setValue,
    setError,
    clearErrors,
    formState: { errors }
  } = methods;

  console.log(watch());

  const handleInputKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    field: any
  ) => {
    if (e.key === 'Enter' && field === 'skills') {
      e.preventDefault();

      const tagInput = e.target as HTMLInputElement;
      const tagValue = tagInput.value;

      if (tagValue !== '') {
        if (tagValue.length > 15) {
          return setError('subcategory', {
            type: 'required',
            message: 'Tag must be less than 15 characters.'
          });
        }
        // Retrieve current skills array
        const currentSkills = skillsTag || [];

        if (!skillsTag.includes(tagValue as never)) {
          setValue('subcategory', [...currentSkills, tagValue]);
          setSkillsTag([...currentSkills, tagValue]);
          tagInput.value = '';
          clearErrors('subcategory');
        }
      }
    }
  };

  // remove skill
  const handleTagRemove = (tag: string, e: any) => {
    e.preventDefault();
    const newTags = skillsTag.filter((t: string) => t !== tag);
    setSkillsTag(newTags);
    setValue('subcategory', newTags);
  };

  const onSubmit = async (data: ICategoryType) => {
    setIsSubmitting(true);
    try {
      const res = await createCategory({
        name: data.name,
        subcategories: data.subcategory,
        path: pathname
      });
      if (res.success) {
        notifySuccess(res.message);
      }
      if (!res.success) {
        notifyError(res.message);
      }
    } catch (error) {
      console.error('Error creating category:', error);
      notifyError('Error creating category');
    } finally {
      setSkillsTag([]);
      setValue('name', '');
      setValue('subcategory', []);
      setIsSubmitting(false);
    }
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="bg-white card-box border-20">
        <div className="dash-input-wrapper mb-30">
          <label htmlFor="">Category Name*</label>
          <Controller
            name="name"
            control={control}
            defaultValue={''}
            render={({ field }) => (
              <>
                <input
                  type="text"
                  placeholder="Enter Category Name"
                  {...field}
                />
                {errors.name && (
                  <ErrorMsg msg={errors.name?.message as string} />
                )}
              </>
            )}
          />
        </div>

        <div className="dash-input-wrapper mb-30">
          <label htmlFor="">SubCategory Skills*</label>

          <div>
            <input
              type="text"
              placeholder="Enter Skills"
              onKeyDown={(e) => handleInputKeyDown(e, 'skills')}
            />
            {errors.subcategory && (
              <ErrorMsg msg={errors.subcategory?.message as string} />
            )}
          </div>

          <ul className="style-none d-flex flex-wrap gap-2  align-items-center mt-2">
            {skillsTag.map((item: any, index) => {
              return (
                <li className="is_tag" key={index}>
                  <button className="is_tag px-2 py-1 ">
                    {item}{' '}
                    <i
                      className="bi text-danger  bi-x"
                      onClick={(e) => handleTagRemove(item, e)}
                    ></i>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
        <div className="button-group d-inline-flex align-items-center mt-30">
          <button
            disabled={isSubmitting}
            type="submit"
            className="dash-btn-two tran3s me-3"
          >
            {isSubmitting ? 'Submitting...' : 'Submit'}
          </button>
        </div>
      </div>
    </form>
  );
};
export default CategoryForm;

// const categories = [
//   {
//     name: '',
//     subcategory: [
//       {
//         name: ''
//       }
//     ]
//   }
// ];
