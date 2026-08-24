import { createGlobalStyle } from 'styled-components';
import { Theme } from '@/types/theme';

export const GlobalStyle = createGlobalStyle<{ theme: Theme }>`
  *, *::before, *::after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  html {
    font-size: 16px;
    scroll-behavior: auto;
  }

  html[data-smooth-scroll='true'][data-reduced-motion='false'] {
    scroll-behavior: smooth;
  }

  @media (prefers-reduced-motion: reduce) {
    html[data-smooth-scroll='true'] {
      scroll-behavior: auto;
    }
  }

  section[id] {
    scroll-margin-top: 70px;
  }

  body {
    font-family: 'Space Grotesk', 'Poppins', sans-serif;
    background-color: ${({ theme }) => theme.colors.background};
    color: ${({ theme }) => theme.colors.text};
    line-height: 1.5;
    min-width: 280px;
    overflow-x: hidden;
    transition: background-color ${({ theme }) => theme.transitions.default},
                color ${({ theme }) => theme.transitions.default};
  }

  h1, h2, h3, h4, h5, h6 {
    font-family: 'Poppins', sans-serif;
    color: ${({ theme }) => theme.colors.primary};
    font-weight: 600;
    line-height: 1.2;
  }

  p {
    font-family: 'Space Grotesk', sans-serif;
  }

  code, pre {
    font-family: 'Fira Code', monospace;
    font-size: 0.9em;
  }

  a {
    color: ${({ theme }) => theme.colors.accent};
    text-decoration: none;
    transition: color ${({ theme }) => theme.transitions.fast};

    &:hover {
      color: ${({ theme }) => theme.colors.primary};
    }
  }

  img {
    max-width: 100%;
    height: auto;
  }

  button {
    font-family: inherit;
    cursor: pointer;
  }

  ::selection {
    background-color: ${({ theme }) => theme.colors.primary};
    color: ${({ theme }) => theme.colors.background};
  }

  ::-webkit-scrollbar {
    width: 10px;
  }

  ::-webkit-scrollbar-track {
    background: ${({ theme }) => theme.colors.surface};
  }

  ::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.colors.primary};
    border-radius: 5px;

    &:hover {
      background: ${({ theme }) => theme.colors.accent};
    }
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    html {
      font-size: 14px;
    }

    section[id] {
      scroll-margin-top: 60px;
    }
  }
`;
