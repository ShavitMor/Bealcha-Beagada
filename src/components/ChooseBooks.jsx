import React from 'react';
import { motion } from 'framer-motion';
import { slideUpVariants, zoomInVariants } from './animation';
import { allProjects } from './export';
import { useNavigate } from 'react-router-dom';

const ChooseBook = () => {
  const navigate = useNavigate();

  const handleBookClick = (bookTitle) => {
    window.location.href=`/reading/${bookTitle}`;
  };

  return (
    <div id='ספרים' className='w-full bg-white min-h-screen'>
      <motion.div
        initial="hidden"
        whileInView="visible"
        variants={slideUpVariants}
        className='lg:w-[80%] w-[90%] m-auto py-[60px] flex flex-col justify-between items-center gap-[20px]'
      >
        <motion.h1 variants={slideUpVariants} className='text-yellow-600 text-2xl'>
          אשרינו שזכינו
        </motion.h1>
        <motion.h1 variants={slideUpVariants} className='text-yellow-600 text-[40px] text-center font-bold'>
          בחר ספר
        </motion.h1>
        <motion.div className='w-[120px] h-[6px] bg-yellow-600' variants={slideUpVariants}></motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          variants={slideUpVariants}
          className='w-full grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 justify-center items-center gap-[30px] mt-[30px]'
        >
          {allProjects.map((item, index) => (
            <motion.div
              key={index}
              variants={zoomInVariants}
              className='flex flex-col items-center justify-start gap-2 p-4 w-full transition-all'
              onClick={() => handleBookClick(item.title)}
             
            >
              <div className="w-[60%] mx-auto">
                <img
                  src={item.icon}
                  alt="icon"
                  className='w-full h-full object-contain cursor-pointer'
                />
              </div>
              <h1 className='text-xl font-bold text-yellow-800 text-center mt-4 cursor-pointer'>{item.title}</h1>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
};

export default ChooseBook;