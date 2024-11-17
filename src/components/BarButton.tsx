import React, { ButtonHTMLAttributes } from 'react';

type BarButtonProps = {
  shortcut?: string
} & ButtonHTMLAttributes<HTMLButtonElement>

const BarButton: React.FC<BarButtonProps> = ({
  shortcut = null,
  children,
  ...props
}) => {
  return <button type='button' className='px-2 py-1 bg-slate-950 border-2' {...props}>
    {shortcut && <span className='text-green-400'>[{shortcut}]</span>}
    <span>{children}</span>
  </button>
}

export default BarButton;