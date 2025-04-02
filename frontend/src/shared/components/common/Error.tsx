import React from 'react';

interface ErrorProps {message: string;}

const Error: React.FC<ErrorProps> = ({message} ) => {
  return (
    <div className='text-red-600'>
      <p> Se ha presentado un error: {message}</p>
    </div>
  );
}

export default Error