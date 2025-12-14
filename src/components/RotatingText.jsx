// import {
//   forwardRef,
//   useCallback,
//   useEffect,
//   useImperativeHandle,
//   useMemo,
//   useState,
// } from "react";
// import { motion,AnimatePresence } from "framer-motion";

// function cn(...classes) {
//   return classes.filter(Boolean).join(" ");
// }

// const RotatingText = forwardRef((props, ref) => {
//   const {
//     texts,
//     transition = { type: "spring", damping: 25, stiffness: 300 },
//     initial = { y: "100%", opacity: 0 },
//     animate = { y: 0, opacity: 1 },
//     exit = { y: "-120%", opacity: 0 },
//     animatePresenceMode = "wait",
//     animatePresenceInitial = false,
//     rotationInterval = 2000,
//     staggerDuration = 0,
//     staggerFrom = "first",
//     loop = true,
//     auto = true,
//     splitBy = "characters",
//     onNext,
//     mainClassName,
//     splitLevelClassName,
//     elementLevelClassName,
//     ...rest
//   } = props;

//   const [currentTextIndex, setCurrentTextIndex] = useState(0);

//   const splitIntoCharacters = (text) => {
//     if (typeof Intl !== "undefined" && Intl.Segmenter) {
//       const segmenter = new Intl.Segmenter("en", { granularity: "grapheme" });
//       return Array.from(segmenter.segment(text), (segment) => segment.segment);
//     }
//     return Array.from(text);
//   };

//   const elements = useMemo(() => {
//     const currentText = texts[currentTextIndex];
//     if (splitBy === "characters") {
//       const words = currentText.split(" ");
//       return words.map((word, i) => ({
//         characters: splitIntoCharacters(word),
//         needsSpace: i !== words.length - 1,
//       }));
//     }
//     if (splitBy === "words") {
//       return currentText.split(" ").map((word, i, arr) => ({
//         characters: [word],
//         needsSpace: i !== arr.length - 1,
//       }));
//     }
//     if (splitBy === "lines") {
//       return currentText.split("\n").map((line, i, arr) => ({
//         characters: [line],
//         needsSpace: i !== arr.length - 1,
//       }));
//     }

//     return currentText.split(splitBy).map((part, i, arr) => ({
//       characters: [part],
//       needsSpace: i !== arr.length - 1,
//     }));
//   }, [texts, currentTextIndex, splitBy]);

//   const getStaggerDelay = useCallback(
//     (index, totalChars) => {
//       const total = totalChars;
//       if (staggerFrom === "first") return index * staggerDuration;
//       if (staggerFrom === "last") return (total - 1 - index) * staggerDuration;
//       if (staggerFrom === "center") {
//         const center = Math.floor(total / 2);
//         return Math.abs(center - index) * staggerDuration;
//       }
//       if (staggerFrom === "random") {
//         const randomIndex = Math.floor(Math.random() * total);
//         return Math.abs(randomIndex - index) * staggerDuration;
//       }
//       return Math.abs(staggerFrom - index) * staggerDuration;
//     },
//     [staggerFrom, staggerDuration]
//   );

//   const handleIndexChange = useCallback(
//     (newIndex) => {
//       setCurrentTextIndex(newIndex);
//       if (onNext) onNext(newIndex);
//     },
//     [onNext]
//   );

//   const next = useCallback(() => {
//     const nextIndex =
//       currentTextIndex === texts.length - 1
//         ? loop
//           ? 0
//           : currentTextIndex
//         : currentTextIndex + 1;
//     if (nextIndex !== currentTextIndex) {
//       handleIndexChange(nextIndex);
//     }
//   }, [currentTextIndex, texts.length, loop, handleIndexChange]);

//   const previous = useCallback(() => {
//     const prevIndex =
//       currentTextIndex === 0
//         ? loop
//           ? texts.length - 1
//           : currentTextIndex
//         : currentTextIndex - 1;
//     if (prevIndex !== currentTextIndex) {
//       handleIndexChange(prevIndex);
//     }
//   }, [currentTextIndex, texts.length, loop, handleIndexChange]);

//   const jumpTo = useCallback(
//     (index) => {
//       const validIndex = Math.max(0, Math.min(index, texts.length - 1));
//       if (validIndex !== currentTextIndex) {
//         handleIndexChange(validIndex);
//       }
//     },
//     [texts.length, currentTextIndex, handleIndexChange]
//   );

//   const reset = useCallback(() => {
//     if (currentTextIndex !== 0) {
//       handleIndexChange(0);
//     }
//   }, [currentTextIndex, handleIndexChange]);

//   useImperativeHandle(
//     ref,
//     () => ({
//       next,
//       previous,
//       jumpTo,
//       reset,
//     }),
//     [next, previous, jumpTo, reset]
//   );

//   useEffect(() => {
//     if (!auto) return;
//     const intervalId = setInterval(next, rotationInterval);
//     return () => clearInterval(intervalId);
//   }, [next, rotationInterval, auto]);

//   return (
//     <motion.span
//       className={cn(
//         "flex flex-wrap whitespace-pre-wrap relative",
//         mainClassName
//       )}
//       {...rest}
//       layout
//       transition={transition}
//     >
//       <span className="sr-only">{texts[currentTextIndex]}</span>
//       <AnimatePresence mode={animatePresenceMode} initial={animatePresenceInitial}>
//         <motion.div
//           key={currentTextIndex}
//           className={cn(
//             splitBy === "lines"
//               ? "flex flex-col w-full"
//               : "flex flex-wrap whitespace-pre-wrap relative"
//           )}
//           layout
//           aria-hidden="true"
//         >
//           {elements.map((wordObj, wordIndex, array) => {
//             const previousCharsCount = array
//               .slice(0, wordIndex)
//               .reduce((sum, word) => sum + word.characters.length, 0);
//             return (
//               <span key={wordIndex} className={cn("inline-flex", splitLevelClassName)}>
//                 {wordObj.characters.map((char, charIndex) => (
//                   <motion.span
//                     key={charIndex}
//                     initial={initial}
//                     animate={animate}
//                     exit={exit}
//                     transition={{
//                       ...transition,
//                       delay: getStaggerDelay(
//                         previousCharsCount + charIndex,
//                         array.reduce((sum, word) => sum + word.characters.length, 0)
//                       ),
//                     }}
//                     className={cn("inline-block", elementLevelClassName)}
//                   >
//                     {char}
//                   </motion.span>
//                 ))}
//                 {wordObj.needsSpace && <span className="whitespace-pre"> </span>}
//               </span>
//             );
//           })}
//         </motion.div>
//       </AnimatePresence>
//     </motion.span>
//   );
// });

// RotatingText.displayName = "RotatingText";
// export default RotatingText;


import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useState,
  useRef,
} from "react";
import { motion, AnimatePresence } from "framer-motion";

// Utility function for conditional class names
function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

// Memoized character splitter to prevent re-creation on every render
const useCharacterSplitter = () => {
  return useCallback((text) => {
    if (typeof Intl !== "undefined" && Intl.Segmenter) {
      try {
        const segmenter = new Intl.Segmenter("en", { granularity: "grapheme" });
        return Array.from(segmenter.segment(text), (segment) => segment.segment);
      } catch {
        // Fallback if Intl.Segmenter fails
        return Array.from(text);
      }
    }
    return Array.from(text);
  }, []);
};

const RotatingText = forwardRef((props, ref) => {
  const {
    texts,
    transition = { 
      type: "spring", 
      damping: 25, 
      stiffness: 300,
      mass: 0.8
    },
    initial = { y: "100%", opacity: 0 },
    animate = { y: 0, opacity: 1 },
    exit = { y: "-120%", opacity: 0 },
    animatePresenceMode = "wait",
    animatePresenceInitial = false,
    rotationInterval = 2000,
    staggerDuration = 50, // Reduced default for better UX
    staggerFrom = "first",
    loop = true,
    auto = true,
    splitBy = "characters",
    onNext,
    onRotateStart,
    onRotateEnd,
    mainClassName,
    splitLevelClassName,
    elementLevelClassName,
    pauseOnHover = false,
    hidePreviousOnExit = true,
    ...rest
  } = props;

  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const intervalRef = useRef(null);
  const splitIntoCharacters = useCharacterSplitter();

  // Memoize the current text elements
  const elements = useMemo(() => {
    const currentText = texts[currentTextIndex] || "";
    
    switch (splitBy) {
      case "characters": {
        const words = currentText.split(" ");
        return words.map((word, i) => ({
          characters: splitIntoCharacters(word),
          needsSpace: i !== words.length - 1,
        }));
      }
      case "words": {
        return currentText.split(" ").map((word, i, arr) => ({
          characters: [word],
          needsSpace: i !== arr.length - 1,
        }));
      }
      case "lines": {
        return currentText.split("\n").map((line, i, arr) => ({
          characters: [line],
          needsSpace: i !== arr.length - 1,
        }));
      }
      default: {
        return currentText.split(splitBy).map((part, i, arr) => ({
          characters: [part],
          needsSpace: i !== arr.length - 1,
        }));
      }
    }
  }, [texts, currentTextIndex, splitBy, splitIntoCharacters]);

  // Calculate total characters for stagger delay
  const totalCharacters = useMemo(() => {
    return elements.reduce((sum, word) => sum + word.characters.length, 0);
  }, [elements]);

  // Optimized stagger delay calculation
  const getStaggerDelay = useCallback((index) => {
    if (staggerDuration <= 0) return 0;
    
    switch (staggerFrom) {
      case "first":
        return index * staggerDuration;
      case "last":
        return (totalCharacters - 1 - index) * staggerDuration;
      case "center": {
        const center = Math.floor(totalCharacters / 2);
        return Math.abs(center - index) * staggerDuration;
      }
      case "random":
        return Math.random() * totalCharacters * staggerDuration;
      default:
        if (typeof staggerFrom === "number") {
          return Math.abs(staggerFrom - index) * staggerDuration;
        }
        return index * staggerDuration;
    }
  }, [staggerFrom, staggerDuration, totalCharacters]);

  // Animation control handlers
  const handleAnimationStart = useCallback(() => {
    setIsAnimating(true);
    onRotateStart?.(currentTextIndex);
  }, [currentTextIndex, onRotateStart]);

  const handleAnimationComplete = useCallback(() => {
    setIsAnimating(false);
    onRotateEnd?.(currentTextIndex);
  }, [currentTextIndex, onRotateEnd]);

  // Navigation handlers
  const handleIndexChange = useCallback((newIndex) => {
    if (newIndex === currentTextIndex) return;
    
    setCurrentTextIndex(newIndex);
    onNext?.(newIndex);
  }, [currentTextIndex, onNext]);

  const next = useCallback(() => {
    if (isAnimating) return;
    
    handleAnimationStart();
    
    const nextIndex = currentTextIndex === texts.length - 1
      ? (loop ? 0 : currentTextIndex)
      : currentTextIndex + 1;
    
    if (nextIndex !== currentTextIndex) {
      handleIndexChange(nextIndex);
    }
  }, [currentTextIndex, texts.length, loop, handleIndexChange, isAnimating, handleAnimationStart]);

  const previous = useCallback(() => {
    if (isAnimating) return;
    
    handleAnimationStart();
    
    const prevIndex = currentTextIndex === 0
      ? (loop ? texts.length - 1 : currentTextIndex)
      : currentTextIndex - 1;
    
    if (prevIndex !== currentTextIndex) {
      handleIndexChange(prevIndex);
    }
  }, [currentTextIndex, texts.length, loop, handleIndexChange, isAnimating, handleAnimationStart]);

  const jumpTo = useCallback((index) => {
    if (isAnimating) return;
    
    handleAnimationStart();
    
    const validIndex = Math.max(0, Math.min(index, texts.length - 1));
    if (validIndex !== currentTextIndex) {
      handleIndexChange(validIndex);
    }
  }, [texts.length, currentTextIndex, handleIndexChange, isAnimating, handleAnimationStart]);

  const reset = useCallback(() => {
    if (isAnimating || currentTextIndex === 0) return;
    
    handleAnimationStart();
    handleIndexChange(0);
  }, [currentTextIndex, handleIndexChange, isAnimating, handleAnimationStart]);

  // Expose methods via ref
  useImperativeHandle(ref, () => ({
    next,
    previous,
    jumpTo,
    reset,
    currentIndex: currentTextIndex,
    isAnimating,
  }), [next, previous, jumpTo, reset, currentTextIndex, isAnimating]);

  // Auto-rotation effect with cleanup
  useEffect(() => {
    if (!auto || isAnimating) return;
    
    const startRotation = () => {
      intervalRef.current = setInterval(() => {
        next();
      }, rotationInterval);
    };

    startRotation();
    
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [auto, rotationInterval, next, isAnimating]);

  // Handle hover pause
  const handleMouseEnter = useCallback(() => {
    if (pauseOnHover && intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, [pauseOnHover]);

  const handleMouseLeave = useCallback(() => {
    if (pauseOnHover && auto && !intervalRef.current && !isAnimating) {
      intervalRef.current = setInterval(next, rotationInterval);
    }
  }, [pauseOnHover, auto, next, rotationInterval, isAnimating]);

  // Render word element
  const renderWord = useCallback((wordObj, wordIndex, array) => {
    const previousCharsCount = array
      .slice(0, wordIndex)
      .reduce((sum, word) => sum + word.characters.length, 0);

    return (
      <span key={`word-${wordIndex}`} className={cn("inline-flex", splitLevelClassName)}>
        {wordObj.characters.map((char, charIndex) => {
          const absoluteIndex = previousCharsCount + charIndex;
          
          return (
            <motion.span
              key={`char-${absoluteIndex}`}
              initial={initial}
              animate={animate}
              exit={hidePreviousOnExit ? exit : { opacity: 0 }}
              transition={{
                ...transition,
                delay: getStaggerDelay(absoluteIndex),
              }}
              className={cn("inline-block", elementLevelClassName)}
              onAnimationStart={charIndex === 0 ? handleAnimationStart : undefined}
              onAnimationComplete={absoluteIndex === totalCharacters - 1 ? handleAnimationComplete : undefined}
            >
              {char}
            </motion.span>
          );
        })}
        {wordObj.needsSpace && <span className="whitespace-pre"> </span>}
      </span>
    );
  }, [initial, animate, exit, transition, getStaggerDelay, splitLevelClassName, elementLevelClassName, hidePreviousOnExit, handleAnimationStart, handleAnimationComplete, totalCharacters]);

  return (
    <motion.span
      ref={ref}
      className={cn(
        "inline-flex flex-wrap whitespace-pre-wrap relative",
        mainClassName
      )}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      aria-live="polite"
      aria-atomic="true"
      {...rest}
      layout="position"
      transition={transition}
    >
      <span className="sr-only">{texts[currentTextIndex]}</span>
      
      <AnimatePresence 
        mode={animatePresenceMode} 
        initial={animatePresenceInitial}
        onExitComplete={handleAnimationComplete}
      >
        <motion.div
          key={`text-${currentTextIndex}`}
          className={cn(
            splitBy === "lines"
              ? "flex flex-col w-full"
              : "inline-flex flex-wrap whitespace-pre-wrap"
          )}
          layout="position"
          aria-hidden="true"
        >
          {elements.map(renderWord)}
        </motion.div>
      </AnimatePresence>
    </motion.span>
  );
});

RotatingText.displayName = "RotatingText";

// Default props for better TypeScript support (if using)
RotatingText.defaultProps = {
  texts: [],
  transition: { type: "spring", damping: 25, stiffness: 300, mass: 0.8 },
  initial: { y: "100%", opacity: 0 },
  animate: { y: 0, opacity: 1 },
  exit: { y: "-120%", opacity: 0 },
  animatePresenceMode: "wait",
  animatePresenceInitial: false,
  rotationInterval: 2000,
  staggerDuration: 50,
  staggerFrom: "first",
  loop: true,
  auto: true,
  splitBy: "characters",
  pauseOnHover: false,
  hidePreviousOnExit: true,
};

export default RotatingText;