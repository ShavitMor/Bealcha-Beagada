import React from 'react';
import SEO from '../components/SEO';
import Header from '../components/Header';
import Hero from '../components/Hero';
import ChooseBooks from '../components/ChooseBooks';

const HomePage = () => {
  return (
    <>
      <SEO 
        title="בהלכה ובאגדה"
        description="ספרי בהלכה ובאגדה מביאות את פסקי מרן הרב עובדיה זצל, בצורה ברורה ונעימה ללמידה"
        keywords="הלכות הרב עובדיה, הלכות, בהלכה ובאגדה, הרב עובדיה יוסף"
        canonicalUrl="https://bealaha-beagada.com/"
      />
      <Header />
      <Hero />
      <ChooseBooks />
    </>
  );
};

export default HomePage;