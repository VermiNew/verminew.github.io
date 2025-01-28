import { createGlobalStyle } from 'styled-components';

export const GlobalStyles = createGlobalStyle`
  :root {
    font-family: Inter, system-ui, Avenir, Helvetica, Arial, sans-serif;
    line-height: 1.5;
    font-weight: 400;
    font-synthesis: none;
    text-rendering: optimizeLegibility;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    margin: 0;
    min-width: 320px;
    min-height: 100vh;
    background-color: ${({ theme }) => theme['colors'].background};
    color: ${({ theme }) => theme['colors'].text};
  }

  a {
    font-weight: 500;
    color: ${({ theme }) => theme['colors'].primary};
    text-decoration: none;
    transition: color 0.3s ease;

    &:hover {
      color: ${({ theme }) => theme['colors'].accent};
    }
  }

  button {
    border-radius: 8px;
    border: 1px solid transparent;
    padding: 0.6em 1.2em;
    font-size: 1em;
    font-weight: 500;
    font-family: inherit;
    background-color: ${({ theme }) => theme['colors'].surface};
    color: ${({ theme }) => theme['colors'].text};
    cursor: pointer;
    transition: all 0.25s ease;

    &:hover {
      border-color: ${({ theme }) => theme['colors'].primary};
    }

    &:focus,
    &:focus-visible {
      outline: 2px solid ${({ theme }) => theme['colors'].primary};
      outline-offset: 2px;
    }
  }

  h1, h2, h3, h4, h5, h6 {
    color: ${({ theme }) => theme['colors'].text};
    line-height: 1.2;
  }

  h1 {
    font-size: 3.2em;
  }

  img {
    max-width: 100%;
    height: auto;
  }

  /* Scrollbar styling */
  ::-webkit-scrollbar {
    width: 10px;
  }

  ::-webkit-scrollbar-track {
    background: ${({ theme }) => theme['colors'].surface};
  }

  ::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme['colors'].primary};
    border-radius: 5px;
    
    &:hover {
      background: ${({ theme }) => theme['colors'].accent};
    }
  }

  /* Selection styling */
  ::selection {
    background: ${({ theme }) => theme['colors'].primary};
    color: ${({ theme }) => theme['colors'].text};
  }
`; 