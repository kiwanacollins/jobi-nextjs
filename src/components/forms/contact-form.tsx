'use client';
import React from 'react';

import { useForm } from 'react-hook-form';
import ErrorMsg from '../common/error-msg';
import { contactFormSchema } from '@/utils/validation';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { createContact } from '@/lib/actions/contact.action';
import { usePathname } from 'next/navigation';
import { notifySuccess } from '@/utils/toast';

const ContactForm = () => {
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const pathname = usePathname();
  type IContactFormType = z.infer<typeof contactFormSchema>;

  // react hook form
  const methods = useForm<IContactFormType>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: '',
      email: '',
      subject: '',
      message: ''
    }
  });

  const {
    handleSubmit,
    register,
    reset,
    formState: { errors }
  } = methods;

  // on submit
  const onSubmit = async (data: IContactFormType) => {
    setIsSubmitting(true);
    try {
      // add server action
      const res = await createContact({ ...data, path: pathname });
      if (res.status === 'success') {
        notifySuccess(res.message);
      }
    } catch (error: any) {
      console.log('onSubmit  error:', error);
    } finally {
      reset();
      setIsSubmitting(false);
    }
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="messages"></div>
      <div className="row controls">
        <div className="col-sm-6">
          <div className="input-group-meta form-group mb-30">
            <label htmlFor="">Name*</label>
            <input
              type="text"
              placeholder="Your Name*"
              {...register('name', { required: `Name is required!` })}
              name="name"
            />
            <div className="help-block with-errors">
              <ErrorMsg msg={errors.name?.message!} />
            </div>
          </div>
        </div>
        <div className="col-sm-6">
          <div className="input-group-meta form-group mb-30">
            <label htmlFor="">Email*</label>
            <input
              type="email"
              placeholder="Email Address*"
              {...register('email')}
              name="email"
            />
            <div className="help-block with-errors">
              <ErrorMsg msg={errors.email?.message!} />
            </div>
          </div>
        </div>
        <div className="col-12">
          <div className="input-group-meta form-group mb-35">
            <label htmlFor="">Subject (optional)</label>
            <input
              {...register('subject')}
              type="text"
              placeholder="Write about the subject here.."
              name="subject"
            />
          </div>
        </div>
        <div className="col-12">
          <div className="input-group-meta form-group mb-35">
            <textarea
              placeholder="Your message*"
              {...register('message')}
              name="message"
            />
            <div className="help-block with-errors">
              <ErrorMsg msg={errors.message?.message!} />
            </div>
          </div>
        </div>
        <div className="col-12">
          <button
            disabled={isSubmitting}
            className="btn-eleven fw-500 tran3s d-block"
          >
            {isSubmitting ? 'Sending...' : 'Send Message'}
          </button>
        </div>
      </div>
    </form>
  );
};

export default ContactForm;
