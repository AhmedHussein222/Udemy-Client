import React from 'react';
import './logo.css'; 
import logo1 from '../../assets/volkswagen_logo2.svg';
import logo2 from '../../assets/samsung_logo.svg';
import logo3 from '../../assets/cisco_logo.svg';
import logo4 from '../../assets/vimeo_logo_resized-2.svg';
import logo5 from '../../assets/procter_gamble_logo.svg';
import logo6 from '../../assets/hewlett_packard_enterprise_logo.svg';
import logo7 from '../../assets/citi_logo.svg';
import logo8 from '../../assets/ericsson_logo.svg';
import { Typography } from '@mui/material';

const Logo = () => {
  const logos = [logo1, logo2, logo3, logo4, logo5,logo6,logo7,logo8];

  return (
    <div className="trusted-container">
  <div style={{ marginBottom: '40px' }}>
    <Typography variant='' className="trusted-title">
      Trusted by over 16,000 companies and millions of learners around the world
    </Typography>
  </div>

  <div className="logos-container">
    {logos.map((logo, index) => (
      <img key={index} src={logo} alt={`Logo ${index}`} className="logo-image" />
    ))}
  </div>
</div>

  );
};

export default Logo;
