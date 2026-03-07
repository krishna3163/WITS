import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  TouchableOpacity, 
  Dimensions,
  Platform
} from 'react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring, 
  runOnJS 
} from 'react-native-reanimated';
import { Gesture, GestureDetector, GestureHandlerRootView } from 'react-native-gesture-handler';
import { Ionicons } from '@expo/vector-icons';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const BUBBLE_SIZE = 70;

export default function AudioBubble({ activeSpace, onOpen }: any) {
  const x = useSharedValue(SCREEN_WIDTH - BUBBLE_SIZE - 20);
  const y = useSharedValue(SCREEN_HEIGHT - 200);

  const [isLive, setIsLive] = useState(false);

  useEffect(() => {
    if (activeSpace) {
      setIsLive(true);
    } else {
      setIsLive(false);
    }
  }, [activeSpace]);

  const panGesture = Gesture.Pan()
    .onChange((event) => {
      x.value += event.changeX;
      y.value += event.changeY;
    })
    .onEnd(() => {
      // Snap to edges
      const snapX = x.value < SCREEN_WIDTH / 2 ? 10 : SCREEN_WIDTH - BUBBLE_SIZE - 10;
      x.value = withSpring(snapX);
      
      // Keep within bounds Y
      if (y.value < 50) y.value = withSpring(50);
      if (y.value > SCREEN_HEIGHT - 150) y.value = withSpring(SCREEN_HEIGHT - 150);
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: x.value }, { translateY: y.value }],
  }));

  if (!isLive) return null;

  return (
    <GestureDetector gesture={panGesture}>
      <Animated.View style={[styles.bubble, animatedStyle]}>
        <TouchableOpacity 
          style={styles.inner} 
          onPress={onOpen}
          activeOpacity={0.8}
        >
          <View style={styles.waves}>
            <Ionicons name="mic" size={24} color="white" />
          </View>
          <View style={styles.liveBadge}>
             <Text style={styles.liveText}>LIVE</Text>
          </View>
        </TouchableOpacity>
      </Animated.View>
    </GestureDetector>
  );
}

const styles = StyleSheet.create({
  bubble: {
    position: 'absolute',
    width: BUBBLE_SIZE,
    height: BUBBLE_SIZE,
    zIndex: 9999,
  },
  inner: {
    flex: 1,
    backgroundColor: '#07C160',
    borderRadius: BUBBLE_SIZE / 2,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  waves: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  liveBadge: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: '#FF3B30',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: '#fff',
  },
  liveText: {
    color: 'white',
    fontSize: 9,
    fontWeight: 'bold',
  },
});
