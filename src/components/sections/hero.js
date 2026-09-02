import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import { usePrefersReducedMotion } from '@hooks';
import TravelMap from '@components/travel-map';

const StyledHeroSection = styled.section`
  ${({ theme }) => theme.mixins.flexCenter};
  flex-direction: column;
  align-items: flex-start;
  min-height: 100vh;
  height: 100vh;
  padding: 0;
  overflow-x: visible; /* allow relative left offset without clipping */

  /* Allow natural height below large-desktop while preserving min-height */
  @media (max-width: 1200px) {
    height: auto;
    overflow-x: hidden; /* prevent horizontal bleed on mobile/tablet */
  }

  /* Prevent fixed header from overlaying hero content on mobile/tablet */
  @media (max-width: 900px) {
    padding-top: var(--nav-height);
  }

  @media (max-height: 1000px) and (min-width: 700px), (max-width: 360px) {
    height: auto;
    padding-top: var(--nav-height);
  }

  h1 {
    margin: 0 0 30px 4px;
    color: var(--green);
    font-family: var(--font-mono);
    font-size: clamp(var(--fz-sm), 5vw, var(--fz-md));
    font-weight: 400;

    @media (max-width: 480px) {
      margin: 0 0 20px 2px;
    }
  }

  h3 {
    margin-top: 5px;
    color: var(--slate);
    line-height: 0.9;
  }

  p {
    margin: 20px 0 0;
    max-width: 540px;
  }

  .email-link {
    ${({ theme }) => theme.mixins.bigButton};
    margin-top: 50px;
  }
`;

// New inner grid for two-column layout
const StyledHeroInner = styled.div`
  width: min(1400px, calc(100vw - clamp(4rem, 10vw, 12rem)));
  margin-left: auto;
  margin-right: auto;
  display: grid;
  grid-template-columns: minmax(0, 0.9fr) minmax(0, 1.1fr);
  grid-template-rows: auto auto;
  grid-template-areas:
    'intro map'
    'whoami projects';
  gap: clamp(28px, 4vw, 56px);
  align-items: start;
  position: relative;
  left: clamp(-10.5rem, -9vw, -7.5rem);

  /* Keep hero mounted; reveal with opacity/visibility only */
  opacity: ${props => (props.$visible ? 1 : 0)};
  visibility: ${props => (props.$visible ? 'visible' : 'hidden')};
  transform: ${props => (props.$visible || props.$reducedMotion ? 'none' : 'translateY(6px)')};
  transition: opacity 400ms ease-out, transform 400ms ease-out;

  > * {
    min-width: 0;
  }

  /* Below large-desktop, let global containers control alignment */
  @media (max-width: 1200px) {
    width: 100%;
    left: 0;
  }

  /* Switch to single-column stack earlier on smaller desktops/tablets */
  @media (max-width: 1080px) {
    grid-template-columns: 1fr; /* stack */
    grid-template-rows: auto;
    grid-template-areas:
      'intro'
      'map'
      'whoami'
      'projects';
  }

  @media (max-width: 900px) {
    width: 100%; /* inherit site container width/padding */
    margin-left: auto;
    margin-right: auto;
    left: 0;
    gap: 24px;
    padding: 0;
  }

  @media (max-width: 600px) {
    gap: 32px;
    padding: 0;
  }
`;

// Left column wrapper
const StyledIntro = styled.div`
  grid-area: intro;
  position: relative;
  z-index: 2; /* ensure text sits above decorative/map layer on mobile */

  @media (max-width: 900px) {
    max-width: 100%;
    width: 100%;
    > * {
      max-width: 100%;
    }
  }
`;

const StyledMapCol = styled.div`
  grid-area: map;
  display: flex;
  align-items: stretch; /* let map fill height of grid area */
  justify-content: stretch; /* let map fill width of grid area */
  overflow: visible;
  position: relative;
  z-index: 1; /* keep map below text layers */
  /* Reserve space for the map on desktop to prevent layout shift */
  aspect-ratio: 1.6 / 1;
  min-height: 320px;

  @media (max-width: 900px) {
    /* On small screens, allow natural flow without forcing height */
    aspect-ratio: auto;
    /* Do not force extra min-height here; inner wrapper governs mobile sizing */
    min-height: 0;
  }

  /* Mirror Brittany's mobile layering pattern (e.g., featured images) */
  @media (max-width: 768px) {
    opacity: 0.45;
  }
`;

const StyledWhoami = styled.div`
  grid-area: whoami;
  align-self: start;
  position: relative;
  z-index: 2;
  > * {
    width: 100%;
  }
  @media (max-width: 900px) {
    max-width: 100%;
    width: 100%;
    > * {
      max-width: 100%;
    }
  }
`;

const StyledProjects = styled.div`
  grid-area: projects;
  align-self: start;
  position: relative;
  z-index: 2;
  > * {
    width: 100%;
  }
  @media (max-width: 900px) {
    max-width: 100%;
    width: 100%;
    > * {
      max-width: 100%;
    }
  }
`;

// Terminal-style panel
const StyledTerminal = styled.div`
  background: var(--light-navy);
  border: 1px solid var(--lightest-navy);
  border-radius: 8px;
  padding: 24px;
  font-family: var(--font-mono);
  width: 100%;
  box-shadow: 0 10px 30px -15px var(--navy-shadow);

  .terminal-header {
    display: flex;
    align-items: center;
    gap: 10px;
    color: var(--slate);
    font-size: var(--fz-sm);
    padding-bottom: 12px;
    margin-bottom: 16px;
    border-bottom: 1px solid var(--lightest-navy);
  }

  .terminal-dots {
    display: inline-flex;
    gap: 6px;
    margin-right: 8px;
  }

  .terminal-dots .dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: var(--slate);
    opacity: 0.85;
  }

  .terminal-title {
    color: var(--slate);
  }

  .terminal-content {
    font-size: var(--fz-sm);
  }

  .prompt {
    margin: 0 0 12px 0;
    color: var(--slate);
  }
  .prompt .dollar {
    color: var(--green);
    margin-right: 6px;
  }
  .prompt .cmd {
    color: var(--white);
  }

  dl {
    margin: 0;
  }

  .row {
    display: grid;
    grid-template-columns: max-content 1fr;
    column-gap: 12px;
    row-gap: 6px;
    margin: 0 0 8px 0;
  }

  dt {
    color: var(--slate);
  }

  dd {
    margin: 0;
    color: var(--white);
  }
`;

const Hero = () => {
  const [heroVisible, setHeroVisible] = useState(false);
  const prefersReducedMotion = usePrefersReducedMotion();

  // Wait for loader to fully exit, then reveal hero as one unit
  useEffect(() => {
    if (prefersReducedMotion) {
      // Still wait for loader to fi[nish to keep SSR/CSR identical
      const onDone = () => setHeroVisible(true);
      if (typeof window !== 'undefined' && window.__APP_LOADER_DONE__) {
        setHeroVisible(true);
        return;
      }
      window.addEventListener('app:loader-finished', onDone, { once: true });
      return () => window.removeEventListener('app:loader-finished', onDone);
    }

    const onDone = () => setHeroVisible(true);
    if (typeof window !== 'undefined' && window.__APP_LOADER_DONE__) {
      setHeroVisible(true);
      return;
    }
    window.addEventListener('app:loader-finished', onDone, { once: true });
    return () => window.removeEventListener('app:loader-finished', onDone);
  }, [prefersReducedMotion]);

  const handleHeroShown = useCallback(e => {
    if (e.target !== e.currentTarget) {
      return;
    }
    if (e.propertyName !== 'opacity') {
      return;
    }
    try {
      if (typeof window !== 'undefined') {
        window.__APP_HERO_VISIBLE__ = true;
        window.dispatchEvent(new Event('app:hero-visible'));
      }
    } catch (e) {
      /* Intentionally ignore errors during hero visibility notification */
    }
  }, []);

  // Left column content
  const one = <h1>Hi, my name is</h1>;
  const two = <h2 className="big-heading">Joseph Gafron.</h2>;
  const three = <h3 className="big-heading">I investigate systems and build practical tools.</h3>;

  const four = (
    <>
      <p>
        I'm a computer science graduate focused on cybersecurity, digital forensics, and AI-powered
        software. I enjoy building practical tools that solve real-world problems.
      </p>
    </>
  );
  const five = (
    <a className="email-link" href="#about">
      About Me
    </a>
  );

  const items = [one, two, three, four, five];

  // Right column: terminal panel
  const terminal = (
    <StyledTerminal role="region" aria-label="Joseph Gafron profile terminal">
      <div className="terminal-header">
        <span className="terminal-dots" aria-hidden="true">
          <span className="dot" />
          <span className="dot" />
          <span className="dot" />
        </span>
        <span className="terminal-title">joseph@portfolio: ~</span>
      </div>
      <div className="terminal-content">
        <p className="prompt">
          <span className="dollar">$</span> <span className="cmd">whoami</span>
        </p>
        <dl>
          <div className="row">
            <dt>name</dt>
            <dd>Joseph Gafron</dd>
          </div>
          <div className="row">
            <dt>role</dt>
            <dd>Computer Science Graduate</dd>
          </div>
          <div className="row">
            <dt>focus</dt>
            <dd>Security Operations · Networking · Digital Forensics</dd>
          </div>
          <div className="row">
            <dt>location</dt>
            <dd>Portland, Oregon</dd>
          </div>
          <div className="row">
            <dt>status</dt>
            <dd>
              <span style={{ color: 'var(--green)' }}>● Always Learning</span>
            </dd>
          </div>
        </dl>
      </div>
    </StyledTerminal>
  );

  return (
    <StyledHeroSection>
      <StyledHeroInner
        $visible={heroVisible}
        $reducedMotion={prefersReducedMotion}
        onTransitionEnd={handleHeroShown}>
        {/* Top-left: Intro */}
        <StyledIntro>
          {items.map((item, i) => (
            <div key={i}>{item}</div>
          ))}
        </StyledIntro>

        {/* Top-right: Map; always mounted and reserving space */}
        <StyledMapCol>
          <TravelMap />
        </StyledMapCol>

        {/* Bottom-left: Existing whoami terminal */}
        <StyledWhoami>{terminal}</StyledWhoami>

        {/* Bottom-right: Projects terminal */}
        <StyledProjects>
          <StyledTerminal role="region" aria-label="Projects terminal">
            <div className="terminal-header">
              <span className="terminal-dots" aria-hidden="true">
                <span className="dot" />
                <span className="dot" />
                <span className="dot" />
              </span>
              <span className="terminal-title">joseph@portfolio: ~/projects</span>
            </div>
            <div className="terminal-content">
              <p className="prompt">
                <span className="dollar">$</span> <span className="cmd">ls projects/</span>
              </p>
              <p>
                <a href="#projects">digital-forensics/</a>
              </p>
              <p>
                <a href="#projects">flowmind/</a>
              </p>

              <p>
                <a href="#projects">wifi-analysis-tool/</a>
              </p>
              <p>
                <a href="#projects">other-projects/</a>
              </p>
            </div>
          </StyledTerminal>
        </StyledProjects>
      </StyledHeroInner>
    </StyledHeroSection>
  );
};

export default Hero;
