import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import { ParticleField } from './ParticleField';
import { FloatingGeometry, TorusKnot, Crystal } from './FloatingGeometry';

interface AnimatedBackgroundProps {
  variant?: 'particles' | 'geometric' | 'mixed';
}

function BackgroundContent({ variant = 'mixed' }: AnimatedBackgroundProps) {
  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} color="#8b5cf6" />
      <pointLight position={[-10, -10, -10]} intensity={0.5} color="#ec4899" />
      
      {variant === 'particles' && (
        <ParticleField count={2000} radius={15} color="#8b5cf6" speed={0.3} />
      )}
      
      {variant === 'geometric' && (
        <>
          <FloatingGeometry position={[-5, 2, -5]} scale={1.5} color="#8b5cf6" />
          <TorusKnot position={[5, -2, -3]} scale={0.8} color="#ec4899" />
          <Crystal position={[0, 3, -8]} scale={1.2} color="#06b6d4" />
          <FloatingGeometry position={[3, -3, -6]} scale={0.6} color="#f59e0b" rotation={[1, 2, 0]} />
          <Crystal position={[-4, -1, -7]} scale={0.8} color="#10b981" />
        </>
      )}
      
      {variant === 'mixed' && (
        <>
          <ParticleField count={1000} radius={20} color="#8b5cf6" speed={0.2} />
          <FloatingGeometry position={[-8, 3, -10]} scale={2} color="#8b5cf6" />
          <TorusKnot position={[8, -3, -8]} scale={1.2} color="#ec4899" />
          <Crystal position={[0, 5, -12]} scale={1.5} color="#06b6d4" />
          <FloatingGeometry position={[6, 4, -6]} scale={0.8} color="#f59e0b" rotation={[0, 1, 2]} />
          <Crystal position={[-6, -4, -9]} scale={1} color="#10b981" />
          <FloatingGeometry position={[0, -8, -11]} scale={1.8} color="#ef4444" rotation={[2, 1, 0]} />
        </>
      )}
    </>
  );
}

export function AnimatedBackground({ variant = 'mixed' }: AnimatedBackgroundProps) {
  return (
    <div className="fixed inset-0 z-0">
      <Canvas>
        <PerspectiveCamera makeDefault position={[0, 0, 5]} />
        <Suspense fallback={null}>
          <BackgroundContent variant={variant} />
          <OrbitControls 
            enableZoom={false} 
            enablePan={false} 
            autoRotate 
            autoRotateSpeed={0.5}
            maxPolarAngle={Math.PI / 2}
            minPolarAngle={Math.PI / 2}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}