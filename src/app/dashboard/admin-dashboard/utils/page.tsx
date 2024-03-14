'use client';
import ErrorMsg from '@/app/components/common/error-msg';
import { zodResolver } from '@hookform/resolvers/zod';
import React, { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import * as z from 'zod';
import {
  createCategory,
  deleteSingleCategory,
  getCategories
} from '@/lib/actions/admin.action';
import { usePathname } from 'next/navigation';
import { notifySuccess } from '@/utils/toast';
import CreatableSelect from 'react-select/creatable';
import { ICategory } from '@/database/categery.model';

const categorySchema = z.object({
  skills: z
    .array(z.string().min(1, { message: 'skills is required' }))
    .refine((val) => val.length > 0, {
      message: 'Please select at least one skill.'
    })
});

const Page = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const pathname = usePathname();
  const [categories, setCategories] = useState<ICategory[]>([]);
  const groupedCategories = categories?.map((category) => category.name);
  type categorySchemaType = z.infer<typeof categorySchema>;
  const methods = useForm<categorySchemaType>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      skills: groupedCategories || []
    }
  });
  const {
    reset,
    watch,
    control,
    handleSubmit,
    formState: { errors }
  } = methods;

  console.log('watch', watch('skills'));

  // remove skill

  const onSubmit = async (data: categorySchemaType) => {
    setIsSubmitting(true);
    console.log(data);
    try {
      await createCategory({
        skills: data.skills,
        path: pathname
      });
      notifySuccess('Category added successfully');
    } catch (error) {
      console.log('error', error);
    } finally {
      setIsSubmitting(false);
      reset();
    }
  };

  useEffect(() => {
    const fetchCategories = async () => {
      const categories = await getCategories();
      setCategories(categories);
    };
    fetchCategories();
  }, []);

  const skillsOptions = groupedCategories?.map((skill) => ({
    value: skill,
    label: skill
  }));

  const handleDeleteCategory = async (id: string) => {
    try {
      const response = await deleteSingleCategory({
        mongoId: id,
        path: pathname
      });
      if (response.success) {
        notifySuccess(response.message);
        const remianCategories = categories.filter((c) => c._id !== id);
        setCategories(remianCategories);
      }
    } catch (error) {
      console.log('error', error);
    }
  };

  return (
    <div>
      {/* Skills start */}
      <div className="dash-input-wrapper mb-30">
        <label className="fw-bold " htmlFor="">
          Add Cateogries
        </label>
        <div className="skills-wrapper">
          <div className="dash-input-wrapper mb-30">
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="skills-wrapper">
                <div className="dash-input-wrapper mb-30">
                  <Controller
                    name="skills"
                    control={control}
                    defaultValue={groupedCategories || []}
                    render={({ field }) => (
                      <CreatableSelect
                        isMulti
                        {...field}
                        //@ts-ignore
                        defaultInputValue={groupedCategories}
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
                  {errors?.skills && <ErrorMsg msg={errors?.skills?.message} />}
                </div>
                <ul className="style-none d-flex flex-wrap align-items-center">
                  {categories?.map((item: any, index) => {
                    return (
                      <li className="is_tag" key={index}>
                        <button>
                          {item.value}
                          <i
                            className="bi bi-x"
                            onClick={(e) => {
                              e.preventDefault();
                              handleDeleteCategory(item._id);
                            }}
                          ></i>{' '}
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>
              <button
                disabled={isSubmitting}
                type="submit"
                className="btn btn-primary mt-2"
              >
                {isSubmitting ? 'Submitting...' : 'Submit'}
              </button>
            </form>
          </div>
        </div>
      </div>
      {/* Skills end */}
    </div>
  );
};

export default Page;
