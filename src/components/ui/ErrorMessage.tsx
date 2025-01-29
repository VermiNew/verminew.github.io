import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FiAlertCircle } from 'react-icons/fi';

interface ErrorMessageProps {
  message: string;
}

const Container = styled(motion.div)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  text-align: center;
  color: ${({ theme }) => theme.colors.error};
`;

const IconWrapper = styled.div`
  font-size: 2rem;
  margin-bottom: 1rem;
`;

const Message = styled.p`
  font-size: 1rem;
  max-width: 400px;
  line-height: 1.6;
`;

export const ErrorMessage: React.FC<ErrorMessageProps> = ({ message }) => {
  return (
    <Container
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <IconWrapper>
        <FiAlertCircle />
      </IconWrapper>
      <Message>{message}</Message>
    </Container>
  );
}; 