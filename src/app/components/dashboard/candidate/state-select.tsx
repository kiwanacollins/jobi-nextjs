import { IState, State } from 'country-state-city';
import React from 'react';

import { UseFormRegister } from 'react-hook-form';

interface IStateSelect {
  register: UseFormRegister<any>;
}

const StateSelect = ({ register }: IStateSelect) => {
  const states = State.getAllStates();
  const handleState = (item: string) => {
    console.log('state', item);
  };
  return (
    <select
      className="form-select"
      aria-label="Default select example"
      {...register('state', { required: true })}
      onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
        handleState(e.target.value)
      }
    >
      <option value="" disabled>
        select state
      </option>
      {states?.map((state: IState, i) => {
        return (
          <option key={i} value={state.name}>
            {state.name}
          </option>
        );
      })}
    </select>
  );
};

export default StateSelect;
