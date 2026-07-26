export const scrollToSection = (id: string, smooth: boolean): void => {
  const element = document.getElementById(id);
  if (!element) return;

  element.scrollIntoView({
    behavior: smooth ? 'smooth' : 'auto',
    block: 'start',
  });
};
