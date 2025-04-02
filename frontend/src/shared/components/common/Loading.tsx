import React from 'react';
import { ClipLoader } from 'react-spinners';

const Loading: React.FC = () => {
  return (
    <div className='flex justify-center items-center h-screen'>
      <div><ClipLoader color='#3b82f6' size= {50}/></div>
      <div><h1 className='text-black text-center ml-8'>Estamos cargando el mejor contenido....</h1></div>
    </div>
  );
}
export default Loading

