import React from 'react';
import './not-found.css';

const Loader = () => {
  return (
    <div className="notfound-wrapper">
   

      {/* Stars animation */}
      <div className="box-of-star1">
        {/* same star divs */}
        <div className="star star-position1" />
           <h1 className="error-code">404</h1>
      <p className="notfound-text">Oops! Page Not Found</p>
        <div className="star star-position2" />
        <div className="star star-position3" />
        <div className="star star-position4" />
        <div className="star star-position5" />
        <div className="star star-position6" />
        <div className="star star-position7" />
      </div>
      {/* box-of-star2, star3, star4... same as before */}

      {/* Astronaut animation */}
      <div data-js="astro" className="astronaut">
        <div className="head" />
        <div className="arm arm-left" />
        <div className="arm arm-right" />
        <div className="body">
          <div className="panel" />
        </div>
        <div className="leg leg-left" />
        <div className="leg leg-right" />
        <div className="schoolbag" />
      </div>
    </div>
  );
};

export default Loader;
