import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import { ParticleField } from './ParticleField';
import { FloatingCode, codeSnippets } from './FloatingCode';

interface AnimatedBackgroundProps {
  variant?: 'particles' | 'geometric' | 'mixed' | 'code';
}

function BackgroundContent({ variant = 'code' }: AnimatedBackgroundProps) {
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
          <FloatingCode code={codeSnippets.javascript[0]} position={[-5, 2, -5]} scale={1.5} color="#f7df1e" />
          <FloatingCode code={codeSnippets.python[0]} position={[5, -2, -3]} scale={0.8} color="#3776ab" />
          <FloatingCode code={codeSnippets.javascript[1]} position={[0, 3, -8]} scale={1.2} color="#06b6d4" />
          <FloatingCode code={codeSnippets.python[1]} position={[3, -3, -6]} scale={0.6} color="#f59e0b" rotation={[0.1, 0.2, 0]} />
          <FloatingCode code={codeSnippets.javascript[2]} position={[-4, -1, -7]} scale={0.8} color="#10b981" />
        </>
      )}

      {variant === 'mixed' && (
        <>
          <ParticleField count={1000} radius={20} color="#8b5cf6" speed={0.2} />
          <FloatingCode code={codeSnippets.javascript[0]} position={[-8, 3, -10]} scale={1.8} color="#f7df1e" />
          <FloatingCode code={codeSnippets.python[0]} position={[8, -3, -8]} scale={1.2} color="#3776ab" />
          <FloatingCode code={codeSnippets.javascript[1]} position={[0, 5, -12]} scale={1.5} color="#06b6d4" />
          <FloatingCode code={codeSnippets.python[2]} position={[6, 4, -6]} scale={0.8} color="#f59e0b" rotation={[0, 0.1, 0.2]} />
          <FloatingCode code={codeSnippets.javascript[3]} position={[-6, -4, -9]} scale={1} color="#10b981" />
          <FloatingCode code={codeSnippets.python[3]} position={[0, -8, -11]} scale={1.6} color="#ec4899" rotation={[0.2, 0.1, 0]} />
        </>
      )}

      {variant === 'code' && (
        <>
          <ParticleField count={800} radius={25} color="#8b5cf6" speed={0.15} />
          {/* JavaScript snippets - Yellow/Gold theme */}
          <FloatingCode code={codeSnippets.javascript[0]} position={[-10, 4, -12]} scale={2} color="#f7df1e" rotation={[0, -0.3, 0]} />
          <FloatingCode code={codeSnippets.javascript[1]} position={[12, -2, -14]} scale={1.8} color="#fbbf24" rotation={[0.1, 0.2, 0]} />
          <FloatingCode code={codeSnippets.javascript[2]} position={[-6, -5, -10]} scale={1.5} color="#f59e0b" rotation={[0, 0.4, 0.1]} />
          <FloatingCode code={codeSnippets.javascript[3]} position={[8, 6, -16]} scale={1.6} color="#fcd34d" rotation={[-0.1, -0.2, 0]} />
          <FloatingCode code={codeSnippets.javascript[4]} position={[-3, 8, -18]} scale={1.4} color="#fde68a" rotation={[0.05, 0.3, 0]} />

          {/* Python snippets - Blue theme */}
          <FloatingCode code={codeSnippets.python[0]} position={[6, 2, -11]} scale={1.9} color="#3776ab" rotation={[0, 0.3, 0]} />
          <FloatingCode code={codeSnippets.python[1]} position={[-12, -3, -13]} scale={1.7} color="#4b8bbe" rotation={[-0.1, -0.2, 0]} />
          <FloatingCode code={codeSnippets.python[2]} position={[3, -7, -15]} scale={1.5} color="#306998" rotation={[0, -0.4, 0.1]} />
          <FloatingCode code={codeSnippets.python[3]} position={[-8, 7, -17]} scale={1.6} color="#5a9fd4" rotation={[0.1, 0.2, 0]} />
          <FloatingCode code={codeSnippets.python[4]} position={[10, -6, -19]} scale={1.3} color="#77b7dd" rotation={[-0.05, -0.3, 0]} />
        </>
      )}
    </>
  );
}

export function AnimatedBackground({ variant = 'code' }: AnimatedBackgroundProps) {
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