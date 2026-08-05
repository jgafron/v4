import React, { useState, useEffect } from 'react';
import { Link } from 'gatsby';
import PropTypes from 'prop-types';
import styled, { css } from 'styled-components';
import { navLinks } from '@config';
import { useScrollDirection } from '@hooks';
import { Menu } from '@components';

const StyledHeader = styled.header`
  ${({ theme }) => theme.mixins.flexBetween};
  position: fixed;
  top: 0;
  z-index: 11;
  padding: 0px 50px;
  width: 100%;
  height: var(--nav-height);
  background-color: transparent;
  filter: none !important;
  pointer-events: auto !important;
  user-select: auto !important;
  backdrop-filter: blur(10px);
  transition: var(--transition);
  /* Keep mounted; reveal with opacity/visibility only */
  opacity: ${props => (props.$visible ? 1 : 0)};
  visibility: ${props => (props.$visible ? 'visible' : 'hidden')};

  @media (max-width: 1080px) {
    padding: 0 40px;
  }
  @media (max-width: 768px) {
    padding: 0 25px;
  }

  @media (prefers-reduced-motion: no-preference) {
    ${props =>
    props.scrollDirection === 'up' &&
      !props.scrolledToTop &&
      css`
        height: var(--nav-scroll-height);
        transform: translateY(0px);
        background-color: rgba(5, 8, 6, 0.85);
        box-shadow: 0 10px 30px -10px var(--navy-shadow);
      `};

    ${props =>
    props.scrollDirection === 'down' &&
      !props.scrolledToTop &&
      css`
        height: var(--nav-scroll-height);
        transform: translateY(calc(var(--nav-scroll-height) * -1));
        box-shadow: 0 10px 30px -10px var(--navy-shadow);
      `};
  }
`;

const StyledNav = styled.nav`
  ${({ theme }) => theme.mixins.flexBetween};
  position: relative;
  width: 100%;
  color: var(--light-slate);
  font-family: var(--font-mono);
  z-index: 12;

  .logo {
    ${({ theme }) => theme.mixins.flexCenter};

    a {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      color: var(--green);
      font-family: var(--font-mono);
      font-size: var(--fz-md);
      line-height: 1;
      padding: 6px 8px;
      border: 1px solid var(--green);
      border-radius: var(--border-radius);
      position: relative;
      z-index: 1;
      text-decoration: none;
      @media (prefers-reduced-motion: no-preference) {
        transition: var(--transition);
      }

      &:hover,
      &:focus-visible {
        outline: 0;
        transform: translate(-3px, -3px);
        box-shadow: 3px 3px 0 0 var(--green);
      }
    }
  }
`;

const StyledLinks = styled.div`
  display: flex;
  align-items: center;

  @media (max-width: 768px) {
    display: none;
  }

  ol {
    ${({ theme }) => theme.mixins.flexBetween};
    padding: 0;
    margin: 0;
    list-style: none;

    li {
      margin: 0 5px;
      position: relative;
      font-size: var(--fz-xs);

      a {
        padding: 10px;
        color: var(--light-slate);
        text-decoration: none;
        @media (prefers-reduced-motion: no-preference) {
          transition: var(--transition);
        }

        &:hover,
        &:focus-visible {
          color: var(--green);
          outline: 0;
        }
      }
    }
  }

  .resume-button {
    ${({ theme }) => theme.mixins.smallButton};
    margin-left: 15px;
    font-size: var(--fz-xs);
  }
`;

const Nav = ({ isHome }) => {
  const [navVisible, setNavVisible] = useState(false);
  const scrollDirection = useScrollDirection('down');
  const [scrolledToTop, setScrolledToTop] = useState(true);

  const handleScroll = () => {
    setScrolledToTop(window.pageYOffset < 50);
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);

    const show = () => setNavVisible(true);
    if (typeof window !== 'undefined' && window.__APP_LOADER_DONE__) {
      show();
    } else {
      window.addEventListener('app:loader-finished', show, { once: true });
    }

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('app:loader-finished', show);
    };
  }, []);

  const Logo = (
    <div className="logo" tabIndex="-1">
      {isHome ? (
        <a href="/" aria-label="home">
          JG
        </a>
      ) : (
        <Link to="/" aria-label="home">
          JG
        </Link>
      )}
    </div>
  );

  const ResumeLink = (
    <a className="resume-button" href="/resume.pdf" target="_blank" rel="noopener noreferrer">
      Resume
    </a>
  );

  return (
    <StyledHeader
      scrollDirection={scrollDirection}
      scrolledToTop={scrolledToTop}
      $visible={navVisible}>
      <StyledNav>
        {Logo}

        <StyledLinks>
          <ol>
            {navLinks &&
              navLinks.map(({ url, name }, i) => (
                <li key={i}>
                  <Link to={url}>{name}</Link>
                </li>
              ))}
          </ol>
          <div>{ResumeLink}</div>
        </StyledLinks>

        <Menu />
      </StyledNav>
    </StyledHeader>
  );
};

Nav.propTypes = {
  isHome: PropTypes.bool,
};

export default Nav;
