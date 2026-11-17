import { motion } from 'framer-motion';
export const FloatingBlobs = () => (
  <>
    {[...Array(5)].map((_, i) => (
      <motion.div
        key={i}
        initial={{ scale: 0, rotate: 0 }}
        animate={{
          scale: [0.8, 1.2, 0.8],
          rotate: [0, 180, 360],
          x: Math.sin((i * Math.PI) / 2.5) * 100,
          y: Math.cos((i * Math.PI) / 2.5) * 100,
        }}
        transition={{
          duration: 10 + i * 2,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className={`absolute w-${40 + i * 20} h-${
          40 + i * 20
        } opacity-10 blur-xl
                bg-gradient-to-r ${
                  i % 2
                    ? 'from-pink-400 to-purple-400'
                    : 'from-cyan-400 to-indigo-400'
                }
                rounded-full`}
      />
    ))}
  </>
);
