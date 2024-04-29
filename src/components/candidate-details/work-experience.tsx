import { IExperience } from '@/database/resume.model';
import React from 'react';

interface IWorkExperienceProps {
  experience: IExperience;
}

const WorkExperience = ({ experience }: IWorkExperienceProps) => {
  return (
    <div className="time-line-data position-relative pt-15">
      <div className="info position-relative">
        <div className="numb fw-500 rounded-circle d-flex align-items-center justify-content-center">
          1
        </div>
        <div className="text_1 fw-500">
          {experience.yearStart} - {experience.yearEnd}
        </div>
        <h4>
          {experience?.title} {` (${experience.company})`}
        </h4>
        <p>{experience?.description}</p>
      </div>
    </div>
  );
};

export default WorkExperience;
