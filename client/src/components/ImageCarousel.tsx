// Enterprise Mall - ImageCarousel Component
// Displays product images in a simple carousel with navigation arrows

import React, { useState } from 'react';
import {
  Box,
  IconButton,
  MobileStepper,
} from '@mui/material';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';

interface ImageCarouselProps {
  images: string[];
  height?: number;
}

const ImageCarousel: React.FC<ImageCarouselProps> = ({ images, height = 400 }) => {
  const [activeStep, setActiveStep] = useState<number>(0);
  const maxSteps: number = images.length;

  if (maxSteps === 0) {
    return (
      <Box sx={{ height, bgcolor: 'grey.200', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 2 }}>
        <span style={{ color: '#999' }}>暂无图片</span>
      </Box>
    );
  }

  const handleNext = () => {
    setActiveStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  return (
    <Box sx={{ position: 'relative', borderRadius: 2, overflow: 'hidden' }}>
      {/* Image display */}
      <Box
        component="img"
        sx={{
          height,
          display: 'block',
          maxWidth: '100%',
          objectFit: 'contain',
          bgcolor: 'grey.100',
        }}
        src={images[activeStep]}
        alt={`Product image ${activeStep + 1}`}
      />

      {/* Navigation arrows */}
      {maxSteps > 1 && (
        <>
          <IconButton
            sx={{ position: 'absolute', left: 8, top: '50%', transform: 'translateY(-50)', bgcolor: 'rgba(255,255,255,0.7)' }}
            onClick={handleBack}
            disabled={activeStep === 0}
          >
            <KeyboardArrowLeft />
          </IconButton>
          <IconButton
            sx={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50)', bgcolor: 'rgba(255,255,255,0.7)' }}
            onClick={handleNext}
            disabled={activeStep === maxSteps - 1}
          >
            <KeyboardArrowRight />
          </IconButton>
        </>
      )}

      {/* Step indicator */}
      {maxSteps > 1 && (
        <MobileStepper
          steps={maxSteps}
          position="static"
          activeStep={activeStep}
          sx={{ bgcolor: 'transparent', justifyContent: 'center' }}
          backButton={undefined}
          nextButton={undefined}
        />
      )}
    </Box>
  );
};

export default ImageCarousel;
