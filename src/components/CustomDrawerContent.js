import React, { useState, useEffect } from 'react';
import { DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';

const CustomDrawerContent = (props) => {
  const [tapCount, setTapCount] = useState(0);
  let tapTimer = null;

  useEffect(() => {
    if (tapCount === 6) {
      console.log('Navigating to AdminLoginScreen...');
      props.navigation.navigate('AdminLogin');
      setTapCount(0); // Reset the tap count after navigation
    }

    return () => {
      if (tapTimer) clearTimeout(tapTimer);
    };
  }, [tapCount, props.navigation]);

  const handleTap = () => {
    setTapCount(prevCount => {
      const newCount = prevCount + 1;
      console.log(`Current tap count: ${newCount}`);
      return newCount;
    });

    if (tapTimer) clearTimeout(tapTimer);
    tapTimer = setTimeout(() => {
      console.log('Resetting tap count after 2 seconds');
      setTapCount(0);
    }, 2000);
  };

  return (
    <DrawerContentScrollView {...props} onTouchEnd={handleTap} style={{ backgroundColor: '#F7E7F8' }}>
      <DrawerItemList {...props} />
    </DrawerContentScrollView>
  );
}

export default CustomDrawerContent;
