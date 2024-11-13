import React, { HTMLProps } from 'react'
import InnerHTML from 'dangerously-set-html-content'

const CustomGridItemComponent = React.forwardRef<HTMLDivElement, HTMLProps<HTMLDivElement> & { content?: string }>(({style, className, onMouseDown, onMouseUp, onTouchEnd, content, ...props}, ref) => {
    return (
      <div style={{...style}} className={className} ref={ref} onMouseDown={onMouseDown} onMouseUp={onMouseUp} onTouchEnd={onTouchEnd} {...props}>
        <div className='absolute -top-3 -left-2 m-0 handle'>
          <button className='bg-white rounded-full inline-flex items-center justify-center text-gray-600 ring ring-offset-2 ring-gray-700 cursor-move'>
            <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        {content && <InnerHTML className="h-full w-full grid place-items-center" html={content} />}
        {!content && (
          <div className='h-full w-full grid place-items-center'>
            <button className='px-4 py-2 border rounded-lg border-solid border-blue' type='button'>insert code</button>
          </div>
        )}
      </div>
    )
  })

  export default CustomGridItemComponent