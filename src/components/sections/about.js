import React, { useEffect, useRef } from 'react';
import { StaticImage } from 'gatsby-plugin-image';
import styled from 'styled-components';
import { srConfig } from '@config';
import sr from '@utils/sr';
import { usePrefersReducedMotion } from '@hooks';

const StyledAboutSection = styled.section`
  max-width: 1040px;
  margin: 0 auto;

  .inner {
    display: grid;
    grid-template-columns: minmax(0, 1.2fr) minmax(280px, 0.8fr);
    grid-gap: 50px;

    @media (max-width: 768px) {
      display: block;
    }
  }
`;

const StyledText = styled.div`
  /* Optional legacy list styles retained (no list rendered) */
  ul.skills-list {
    display: grid;
    grid-template-columns: repeat(2, minmax(140px, 200px));
    grid-gap: 0 10px;
    padding: 0;
    margin: 20px 0 0 0;
    overflow: hidden;
    list-style: none;

    li {
      position: relative;
      margin-bottom: 10px;
      padding-left: 20px;
      font-family: var(--font-mono);
      font-size: var(--fz-xs);

      &:before {
        content: '▹';
        position: absolute;
        left: 0;
        color: var(--green);
        font-size: var(--fz-sm);
        line-height: 12px;
      }
    }
  }

  /* Minimal terminal panel styles (match hero terminal where practical) */
  .terminal {
    background: var(--light-navy);
    border: 1px solid var(--lightest-navy);
    border-radius: 8px;
    padding: 18px 22px;
    box-shadow: 0 10px 30px -15px var(--navy-shadow);
  }

  .terminal-header {
    display: flex;
    align-items: center;
    gap: 10px;
    color: var(--slate);
    font-family: var(--font-mono);
    font-size: var(--fz-sm);
    padding-bottom: 8px;
    margin-bottom: 10px;
    border-bottom: 1px solid var(--lightest-navy);
  }

  .terminal-title {
    color: var(--slate);
  }

  .terminal-content {
    font-size: var(--fz-sm);
  }

  .prompt {
    margin: 0 0 8px 0;
    font-family: var(--font-mono);
    color: var(--slate);
  }
  .prompt .dollar {
    color: var(--green);
    margin-right: 6px;
  }
  .prompt .cmd {
    color: var(--white);
  }

  .body {
    font-family: var(--font-sans);
    color: var(--white);
    font-size: clamp(17px, 1.1vw, 19px);
    line-height: 1.5;
  }

  .body p {
    margin: 0 0 1rem 0;
  }
  .body .accent {
    color: var(--green);
  }
`;
const StyledPic = styled.div`
  position: relative;
  max-width: 340px;
  justify-self: end;
  align-self: center;

  @media (max-width: 768px) {
    margin: 50px auto 0;
    width: 70%;
  }

  .wrapper {
    ${({ theme }) => theme.mixins.boxShadow};
    display: block;
    position: relative;
    width: 100%;
    border-radius: var(--border-radius);
    background-color: var(--green);

    &:hover,
    &:focus {
      outline: 0;
      transform: translate(-4px, -4px);

      &:after {
        transform: translate(8px, 8px);
      }

      .img {
        filter: none;
        mix-blend-mode: normal;
      }
    }

    .img {
      position: relative;
      border-radius: var(--border-radius);
      mix-blend-mode: multiply;
      filter: grayscale(100%) contrast(1);
      transition: var(--transition);
    }

    &:before,
    &:after {
      content: '';
      display: block;
      position: absolute;
      width: 100%;
      height: 100%;
      border-radius: var(--border-radius);
      transition: var(--transition);
    }

    &:before {
      top: 0;
      left: 0;
      background-color: var(--navy);
      mix-blend-mode: screen;
    }

    &:after {
      border: 2px solid var(--green);
      top: 14px;
      left: 14px;
      z-index: -1;
    }
  }
`;

const About = () => {
  const revealContainer = useRef(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion) {
      return;
    }

    sr.reveal(revealContainer.current, srConfig());
  }, []);

  return (
    <StyledAboutSection id="about" ref={revealContainer}>
      <h2 className="numbered-heading">About Me</h2>

      <div className="inner">
        <StyledText>
          <div className="terminal" role="region" aria-label="About terminal panel">
            <div className="terminal-header">
              <span className="terminal-title">joseph@portfolio: ~/about</span>
            </div>
            <div className="terminal-content">
              <p className="prompt">
                <span className="dollar">$</span> <span className="cmd">cat about.txt</span>
              </p>
              <div className="body">
                <p>
                  My path into tech started in a weird place:{' '}
                  <strong className="accent">culinary school</strong>. I spent years in professional
                  kitchens, but outside of work I couldn't stop taking things apart, Linux boxes,
                  Raspberry Pis, whatever I could get my hands on. I was making summer trips to{' '}
                  <strong className="accent">DEF CON</strong> before any of this was formal, just
                  because I loved it.
                </p>

                <p>
                  Eventually that curiosity won out. I went back to school, earned my computer
                  science degree, and graduated <strong className="accent">Cum Laude</strong> while
                  working full time and doing remote work for a company in Boise. It was not an easy
                  stretch, but it taught me how to move fast and keep going even when the schedule
                  fought back.
                </p>

                <p>
                  These days I've been genuinely hooked on security operations, networking, and
                  digital forensics. I'm in the{' '}
                  <strong className="accent">top 15% of TryHackMe users</strong>, and there's still
                  nothing like the feeling of finally cracking a room I've been stuck on for hours.
                </p>

                <p>
                  Off the clock, I train <strong className="accent">Brazilian jiu-jitsu</strong>. I
                  competed young, stepped away for years, and came back a while ago completely
                  hooked all over again. Language Learning (<strong className="accent">Thai</strong>
                  ) has been a slow, ongoing project for a few years now, travel happens when it can
                  (<strong className="accent">look at the map above to see where I've been!</strong>
                  ), and most days end with relaxing on the balcony with my dogs.
                </p>
              </div>
            </div>
          </div>
        </StyledText>

        <StyledPic>
          <div className="wrapper">
            <StaticImage
              className="img"
              src="../../images/joseph.png"
              width={500}
              quality={95}
              formats={['AUTO', 'WEBP', 'AVIF']}
              alt="Joseph Gafron"
              imgStyle={{ objectFit: 'cover', objectPosition: '50% 50%' }}
            />
          </div>
        </StyledPic>
      </div>
    </StyledAboutSection>
  );
};

export default About;
