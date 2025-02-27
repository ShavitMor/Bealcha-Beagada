import React, { useState, useEffect, lazy, Suspense } from 'react';
import { motion } from 'framer-motion';
import { slideUpVariants, zoomInVariants } from './animation';
import { allProjects } from './export';
import { useNavigate } from 'react-router-dom';

// Lazy image component
const LazyImage = ({ src, alt, className, onClick }) => {
  const [imageSrc, setImageSrc] = useState(null);
  
  useEffect(() => {
    const img = new Image();
    img.src = src;
    img.onload = () => {
      setImageSrc(src);
    };
  }, [src]);
  
  return (
    <div className={`${className} relative`} onClick={onClick}>
      {!imageSrc && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          <div className="w-8 h-8 border-4 border-yellow-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
      {imageSrc && <img src={imageSrc} alt={alt} className={`${className} transition-opacity duration-300`} />}
    </div>
  );
};

const ChooseBook = () => {
  const navigate = useNavigate();
  const [visibleProjects, setVisibleProjects] = useState([]);

  useEffect(() => {
    // Initially load only the first few projects
    setVisibleProjects(allProjects.slice(0, 3));
    
    // Use Intersection Observer to detect when user scrolls near the bottom
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        // Load more projects when user scrolls into view
        setVisibleProjects(allProjects);
        observer.disconnect();
      }
    }, { threshold: 0.1 });
    
    const target = document.getElementById('ספרים');
    if (target) observer.observe(target);
    
    return () => {
      if (target) observer.unobserve(target);
    };
  }, []);

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
          {visibleProjects.map((item, index) => (
            <motion.div
              key={index}
              variants={zoomInVariants}
              className='flex flex-col items-center justify-start gap-2 p-4 w-full transition-all'
              onClick={() => handleBookClick(item.title)}
            >
              <div className="w-[60%] mx-auto">
                <LazyImage
                  src={item.icon}
                  alt="icon"
                  className='w-full h-full object-contain cursor-pointer'
                  onClick={() => handleBookClick(item.title)}
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