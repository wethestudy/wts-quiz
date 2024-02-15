import React, { useEffect } from 'react';

const MathJaxRenderer = () => {
  useEffect(() => {
    if (window.MathJax) {
      window.MathJax.typeset();
    }
  }, []);

  return null;
};

export default MathJaxRenderer;