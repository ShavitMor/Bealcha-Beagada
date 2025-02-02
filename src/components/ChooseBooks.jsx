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
              className='flex flex-col items-center justify-start gap-2 p-4 w-full cursor-pointer bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105'
              onClick={() => handleBookClick(item.title)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <motion.div
                className='w-[80px] h-[80px] border-4 border-yellow-500 rounded-lg p-2 flex items-center justify-center'
                whileHover={{ rotate: 5, scale: 1.1 }}
              >
                <img
                  src={item.icon}
                  alt="icon"
                  className='w-full h-full object-contain'
                />
              </motion.div>
              <h1 className='text-xl font-bold text-yellow-800 text-center mt-4'>{item.title}</h1>
              <p className='text-[16px] text-yellow-700 text-center'>{item.about}</p>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
};

export default ChooseBook;