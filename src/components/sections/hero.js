import React, { useState, useEffect } from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import styled from 'styled-components';
import { navDelay, loaderDelay } from '@utils';
import { usePrefersReducedMotion } from '@hooks';

const StyledHeroSection = styled.section`
  ${({ theme }) => theme.mixins.flexCenter};
  flex-direction: column;
  align-items: flex-start;
  min-height: 100vh;
  height: 100vh;
  padding: 0;

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
  width: 100%;
  display: grid;
  grid-template-columns: minmax(0, 1.15fr) minmax(320px, 0.85fr);
  gap: 56px;
  align-items: center;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
    gap: 44px;
  }

  @media (max-width: 600px) {
    gap: 32px;
  }
`;

// Left column wrapper
const StyledIntro = styled.div``;

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
    <a className="email-link" href="#projects">
      View My Work
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
          <StyledIntro>
            {items.map((item, i) => (
              <div key={i}>{item}</div>
            ))}
          </StyledIntro>
          {terminal}
        </StyledHeroInner>
      ) : (
        <StyledHeroInner>
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

          <TransitionGroup component={null}>
            {isMounted && (
              <CSSTransition classNames="fadeup" timeout={loaderDelay}>
                <div style={{ transitionDelay: `${items.length + 1}00ms` }}>{terminal}</div>
              </CSSTransition>
            )}
          </TransitionGroup>
        </StyledHeroInner>
      )}
    </StyledHeroSection>
  );
};

export default Hero;
