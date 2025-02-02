import React from 'react';
import backgroundImage from '../images/maranBack.png';
import { motion } from 'framer-motion';
import { slideUpVariants, zoomInVariants } from './animation';

const Hero = () => {
  const scrollToSection = () => {
    const section = document.getElementById('ספרים');
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div
      id="hero"
      className="bg-black w-full lg:h-[700px] h-fit m-auto pt-[60px] lg:pt-[0px] lg:px-[150px] px-[20px] flex justify-between items-center lg:flex-row flex-col lg:gap-5 gap-[50px] bg-cover bg-center"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <motion.div
        initial="hidden"
        whileInView="visible"
        variants={slideUpVariants}
        className="lg:w-[60%] w-full flex flex-col justify-center items-start lg:gap-8 gap-4"
      >
        <motion.h1
          variants={slideUpVariants}
          className="text-yellow-500 text-[52px] font-bold mb-[-30px] font-[sblFont]"
        >
          הלכות
        </motion.h1>
        <motion.h1
          variants={slideUpVariants}
          className="text-yellow-500 text-[52px] font-bold leading-[1] font-[sblFont]"
        >
          הרב עובדיה יוסף
        </motion.h1>
        <div className="w-[120px] h-[6px] bg-yellow-500"></div>
        <p className="text-yellow-500 text-[30px]  mb-[-25px] font-[sblFont]">על פי ספרי בהלכה ובאגדה </p>
        <p className="text-yellow-500 text-[30px] font-[sblFont]">הרב דוד שלום נקי</p>
        <motion.div
          initial="hidden"
          whileInView="visible"
          variants={zoomInVariants}
          className="flex justify-center items-center gap-5"
        >
          <motion.button
            variants={zoomInVariants}
            className="bg-yellow-500 hover:bg-white hover:text-yellow-500 px-8 py-3 rounded-lg text-black font-bold"
            style={{ fontSize: '19px' }}
            onClick={scrollToSection}
          >
            לספרייה 
          </motion.button>
        </motion.div>
      </motion.div>
      <div className="w-[40%] flex flex-col justify-end items-end"></div>
    </div>
  );
};

export default Hero;
