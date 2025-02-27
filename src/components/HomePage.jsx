import React, { lazy, Suspense } from 'react';
import SEO from '../components/SEO';

// Lazy load components
const Header = lazy(() => import('../components/Header'));
const Hero = lazy(() => import('../components/Hero'));
const ChooseBooks = lazy(() => import('../components/ChooseBooks'));

// Loading fallback component
const LoadingComponent = () => (
  <div style={{ textAlign: 'center', padding: '20px' }}>
    טוען...
  </div>
);

const HomePage = () => {
  return (
    <>
      <SEO 
        title="בהלכה ובאגדה"
        description="ספרי בהלכה ובאגדה מביאות את פסקי מרן הרב עובדיה זצל, בצורה ברורה ונעימה ללמידה"
        keywords="הלכות הרב עובדיה, הלכות, בהלכה ובאגדה, הרב עובדיה יוסף"
        canonicalUrl="https://bealaha-beagada.com/"
      />
      <Suspense >
        <Header />
      </Suspense>
      <Suspense >
        <Hero />
      </Suspense>
      <Suspense >
        <ChooseBooks />
      </Suspense>
    </>
  );
};

export default HomePage;