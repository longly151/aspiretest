import React from 'react';
import { styled } from 'nativewind';

const withTailwind = (WrappedComponent: React.ComponentType<any>) => {
  const WithTailwind = styled(WrappedComponent);

  return WithTailwind;
};

export default withTailwind;
