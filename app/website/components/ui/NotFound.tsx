'use client';
import { motion } from 'framer-motion';
import { Frown } from 'lucide-react';

const NotFound = ({ message }: { message: string }) => {
  return (
    <div className='min-h-screen flex flex-col items-center justify-center px-6'>
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className='text-center'
      >
        <Frown className='w-20 h-20 text-purple-500 mx-auto mb-6 animate-bounce' />
        <h1 className='text-3xl font-bold text-purple-700 mb-2'>{message}</h1>
        <p className='text-gray-600 mb-6'>
          The event you are looking for might be deleted or unavailable.
        </p>
        <motion.a
          href='/'
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className='inline-block bg-purple-600 text-white px-6 py-3 rounded-lg shadow-md hover:bg-purple-700 transition-all'
        >
          Back to Home
        </motion.a>
      </motion.div>
    </div>
  );
};

export default NotFound;
