import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { usePrefersReducedMotion } from '@hooks';

const StyledSideElement = styled.div`
  width: 40px;
  position: fixed;
  bottom: 0;
  left: ${props => (props.orientation === 'left' ? '40px' : 'auto')};
  right: ${props => (props.orientation === 'left' ? 'auto' : '40px')};
  z-index: 10;
  color: var(--light-slate);

  /* Keep mounted; reveal with opacity/visibility only */
  opacity: ${props => (props.$visible ? 1 : 0)};
  visibility: ${props => (props.$visible ? 'visible' : 'hidden')};
  transition: opacity 350ms ease-out;

  @media (max-width: 1080px) {
    left: ${props => (props.orientation === 'left' ? '20px' : 'auto')};
    right: ${props => (props.orientation === 'left' ? 'auto' : '20px')};
  }

  @media (max-width: 768px) {
    display: none;
  }
`;

const Side = ({ children, orientation }) => {
  const [visible, setVisible] = useState(false);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    const show = () => setVisible(true);

    // Reveal after loader exits to prevent flashing/staggered mounts
    if (typeof window !== 'undefined' && window.__APP_LOADER_DONE__) {
      show();
      return;
    }

    window.addEventListener('app:loader-finished', show, { once: true });
    return () => window.removeEventListener('app:loader-finished', show);
  }, []);

  return (
    <StyledSideElement
      orientation={orientation}
      $visible={prefersReducedMotion ? visible : visible}>
      {children}
    </StyledSideElement>
  );
};

Side.propTypes = {
  children: PropTypes.node.isRequired,
  orientation: PropTypes.string,
};

export default Side;
