import React, { ButtonHTMLAttributes } from 'react';

type FancyButtonProps = {
  invert?: boolean
} & ButtonHTMLAttributes<HTMLButtonElement>

const AddNewButtonComponent: React.FC<FancyButtonProps> = ({
  children,
  ...props
}) => {
  return <button type='button' className='bg-black px-3 py-1 border rounded-lg border-solid border-green-500' {...props}>
    {children}
  </button>
}

export default AddNewButtonComponent;