import React, { useState, useEffect } from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import styled from 'styled-components';
import { navDelay, loaderDelay } from '@utils';
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

  @media (max-height: 700px) and (min-width: 700px), (max-width: 360px) {
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

  > * {
    min-width: 0;
  }

  @media (max-width: 900px) {
    width: calc(100vw - 2rem);
    margin-left: auto;
    margin-right: auto;
    left: 0;
    grid-template-columns: 1fr; /* stack on small screens */
    grid-template-rows: auto;
    grid-template-areas:
      'intro'
      'map'
      'whoami'
      'projects';
    gap: 44px;
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
`;

const StyledMapCol = styled.div`
  grid-area: map;
  display: flex;
  align-items: stretch; /* let map fill height of grid area */
  justify-content: stretch; /* let map fill width of grid area */
  overflow: visible;
  min-height: 100%;
`;

const StyledWhoami = styled.div`
  grid-area: whoami;
  align-self: start;
  > * {
    width: 100%;
  }
`;

const StyledProjects = styled.div`
  grid-area: projects;
  align-self: start;
  > * {
    width: 100%;
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
  const [isMounted, setIsMounted] = useState(false);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion) {
      return;
    }

    const timeout = setTimeout(() => setIsMounted(true), navDelay);
    return () => clearTimeout(timeout);
  }, []);

  // Left column content
  const one = <h1>Hi, my name is</h1>;
  const two = <h2 className="big-heading">Joseph Gafron.</h2>;
  const three = <h3 className="big-heading">I investigate systems and build practical tools.</h3>;
  const four = (
    <>
      <p>
        I’m a computer science graduate focused on security operations, networking, and digital
        forensics. I enjoy turning complex technical problems into clear, repeatable solutions.
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
            <dd>Open to opportunities</dd>
          </div>
        </dl>
      </div>
    </StyledTerminal>
  );

  return (
    <StyledHeroSection>
      {prefersReducedMotion ? (
        <StyledHeroInner>
          {/* Top-left: Intro */}
          <StyledIntro>
            {items.map((item, i) => (
              <div key={i}>{item}</div>
            ))}
          </StyledIntro>

          {/* Top-right: Map */}
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
                  <a href="#projects">trimet-pipeline/</a>
                </p>
                <p>
                  <a href="#projects">wifi-analysis-tool/</a>
                </p>
              </div>
            </StyledTerminal>
          </StyledProjects>
        </StyledHeroInner>
      ) : (
        <StyledHeroInner>
          {/* Top-left: Intro with animated items */}
          <StyledIntro>
            <TransitionGroup component={null}>
              {isMounted &&
                items.map((item, i) => (
                  <CSSTransition key={i} classNames="fadeup" timeout={loaderDelay}>
                    <div style={{ transitionDelay: `${i + 1}00ms` }}>{item}</div>
                  </CSSTransition>
                ))}
            </TransitionGroup>
          </StyledIntro>

          {/* Top-right: Map with animation */}
          <TransitionGroup component={null}>
            {isMounted && (
              <CSSTransition classNames="fadeup" timeout={loaderDelay}>
                <StyledMapCol style={{ transitionDelay: `${items.length + 2}00ms` }}>
                  <TravelMap />
                </StyledMapCol>
              </CSSTransition>
            )}
          </TransitionGroup>

          {/* Bottom-left: Existing whoami terminal with animation */}
          <TransitionGroup component={null}>
            {isMounted && (
              <CSSTransition classNames="fadeup" timeout={loaderDelay}>
                <StyledWhoami style={{ transitionDelay: `${items.length + 1}00ms` }}>
                  {terminal}
                </StyledWhoami>
              </CSSTransition>
            )}
          </TransitionGroup>

          {/* Bottom-right: Projects terminal with animation */}
          <TransitionGroup component={null}>
            {isMounted && (
              <CSSTransition classNames="fadeup" timeout={loaderDelay}>
                <StyledProjects style={{ transitionDelay: `${items.length + 3}00ms` }}>
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
                        <a href="#projects">trimet-pipeline/</a>
                      </p>
                      <p>
                        <a href="#projects">wifi-analysis-tool/</a>
                      </p>
                    </div>
                  </StyledTerminal>
                </StyledProjects>
              </CSSTransition>
            )}
          </TransitionGroup>
        </StyledHeroInner>
      )}
    </StyledHeroSection>
  );
};

export default Hero;
