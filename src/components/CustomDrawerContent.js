import React, { useState } from 'react';
import { DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';

const CustomDrawerContent = (props) => {
  const [tapCount, setTapCount] = useState(0);
  let tapTimer = null;

  const handleTap = () => {
    setTapCount(tapCount + 1);

    if (tapTimer) clearTimeout(tapTimer);
    tapTimer = setTimeout(() => setTapCount(0), 2000);

    if (tapCount + 1 === 6) {
      props.navigation.navigate('AdminLogin');
      setTapCount(0);
    }
  };

  return (
    <DrawerContentScrollView {...props} onTouchEnd={handleTap} style={{ backgroundColor: '#F7E7F8' }}>
      <DrawerItemList {...props} />
    </DrawerContentScrollView>
  );
}

export default CustomDrawerContent;
