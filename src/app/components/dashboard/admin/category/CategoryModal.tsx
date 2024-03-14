'use client';
import React, { useEffect, useState } from 'react';
import CategoryForm from './CategoryForm';
import { ICategory } from '@/database/categery.model';
import { getSingleCategoryById } from '@/lib/actions/admin.action';

interface IProps {
  id: string;
}

const CategoryModal = ({ id }: IProps) => {
  const [selectedCategory, setCategory] = useState<ICategory | null>(null);
  // const category = await getSingleCategoryById(id);
  useEffect(() => {
    const fetchCategory = async () => {
      const response = await getSingleCategoryById(id as string);
      setCategory(response);
    };
    fetchCategory();
  }, [id]);
  return (
    <div
      className="modal fade"
      id={'categoryModal' + id}
      tabIndex={-1}
      aria-hidden="true"
    >
      <div className="modal-dialog ">
        <div className="container">
          <div className="user-data-form modal-content">
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
            <div className="text-center">
              <h2>Update Category</h2>
            </div>
            <div className="text-center">{id}</div>
            <div className="text-center">{selectedCategory?.name}</div>
            <div className="form-wrapper">
              <CategoryForm category={selectedCategory} type="edit" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryModal;
