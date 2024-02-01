import React from 'react';

const Skills = ({ skills }: { skills: string[] }) => {
  return (
    <ul className="style-none skill-tags d-flex flex-wrap pb-25">
      {skills?.length > 0 &&
        skills?.map((item: string, index: any) => (
          <li key={item + index}>{item}</li>
        ))}
      {/* <li className="more">3+</li> */}
    </ul>
  );
};

export default Skills;
