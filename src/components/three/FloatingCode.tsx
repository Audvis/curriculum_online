import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import { Group } from 'three';

interface FloatingCodeProps {
  code: string;
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: number;
  color?: string;
  language?: 'javascript' | 'python';
}

export function FloatingCode({
  code,
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 1,
  color = '#ffffff',
}: FloatingCodeProps) {
  const groupRef = useRef<Group>(null);
  const initialY = position[1];

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.x = rotation[0] + Math.sin(state.clock.getElapsedTime() * 0.3) * 0.1;
      groupRef.current.rotation.y = rotation[1] + state.clock.getElapsedTime() * 0.05;
      groupRef.current.rotation.z = rotation[2] + Math.cos(state.clock.getElapsedTime() * 0.2) * 0.05;

      // Floating effect
      groupRef.current.position.y = initialY + Math.sin(state.clock.getElapsedTime() * 0.5) * 0.3;
    }
  });

  return (
    <group ref={groupRef} position={position} scale={scale}>
      <Text
        fontSize={0.3}
        color={color}
        anchorX="center"
        anchorY="middle"
        maxWidth={10}
        lineHeight={1.4}
        letterSpacing={0.02}
        textAlign="left"
      >
        {code}
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.3}
          metalness={0.5}
          roughness={0.3}
        />
      </Text>
    </group>
  );
}

// Sample code snippets
export const codeSnippets = {
  javascript: [
    `const fibonacci = (n) => {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
};`,
    `async function fetchData(url) {
  const response = await fetch(url);
  const data = await response.json();
  return data;
}`,
    `const users = data
  .filter(user => user.active)
  .map(user => user.name)
  .sort();`,
    `class EventEmitter {
  constructor() {
    this.events = {};
  }
  emit(event, data) {
    this.events[event]?.(data);
  }
}`,
    `const debounce = (fn, delay) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  };
};`,
  ],
  python: [
    `def quicksort(arr):
    if len(arr) <= 1:
        return arr
    pivot = arr[len(arr) // 2]
    left = [x for x in arr if x < pivot]
    middle = [x for x in arr if x == pivot]
    right = [x for x in arr if x > pivot]
    return quicksort(left) + middle + quicksort(right)`,
    `@decorator
def fetch_api_data(endpoint):
    with requests.Session() as session:
        response = session.get(endpoint)
        return response.json()`,
    `class DataProcessor:
    def __init__(self, data):
        self.data = data

    def transform(self):
        return [x * 2 for x in self.data]`,
    `async def main():
    tasks = [
        fetch_data(url)
        for url in urls
    ]
    results = await asyncio.gather(*tasks)
    return results`,
    `import numpy as np

matrix = np.array([[1, 2], [3, 4]])
eigenvalues = np.linalg.eigvals(matrix)`,
  ],
};
