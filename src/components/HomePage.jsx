import React from 'react';
import Header from '../components/Header';
import Hero from '../components/Hero';
import ChooseBooks from '../components/ChooseBooks';
import SEO from '../components/SEO';

const HomePage = () => {
  return (
    <>
      <SEO 
        title="בהלכה ובאגדה"
        description="ספרי בהלכה ובאגדה מביאות את פסקי מרן הרב עובדיה זצל, בצורה ברורה ונעימה ללמידה"
        keywords="הלכות הרב עובדיה, הלכות, בהלכה ובאגדה, הרב עובדיה יוסף, הרב דוד שלום נקי"
        canonicalUrl="https://bealcha-ve-beagada.netlify.app/"
      />
      <Header />
      <Hero />
      <ChooseBooks/>
    </>
  );
};

export default HomePage;