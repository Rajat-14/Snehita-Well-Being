import React from 'react';
import { useSpring, animated } from 'react-spring';

const ComplexAnimationComponent = () => {
  const { backgroundColor } = useSpring({
    from: { backgroundColor: 'rgb(255, 0, 0)' }, // Initial color
    to: async (next) => {
      // Color mixing animation
      while (true) {
        await next({ backgroundColor: 'rgb(0, 255, 0)' }); // Change to green
        await next({ backgroundColor: 'rgb(0, 0, 255)' }); // Change to blue
        await next({ backgroundColor: 'rgb(255, 0, 0)' }); // Change back to red
      }
    },
    config: { duration: 5000 }, // Animation duration
  });

  return (
    <animated.div
      style={{
        width: '100%',
        height: '100vh',
        backgroundColor,
      }}
    >
      {/* Content goes here */}
    </animated.div>
  );
};

export default ComplexAnimationComponent;
