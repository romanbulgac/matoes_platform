import { useLayoutEffect, useRef, useCallback } from 'react';
import { gsap } from 'gsap';

// Глобальный менеджер анимаций
class AnimationManager {
  private contexts = new Map<string, gsap.Context>();
  private static instance: AnimationManager;

  static getInstance() {
    if (!AnimationManager.instance) {
      AnimationManager.instance = new AnimationManager();
    }
    return AnimationManager.instance;
  }

  getOrCreateContext(key: string, scope?: Element): gsap.Context {
    if (!this.contexts.has(key)) {
      const ctx = gsap.context(() => {}, scope);
      this.contexts.set(key, ctx);
    }
    return this.contexts.get(key)!;
  }

  cleanupContext(key: string) {
    const ctx = this.contexts.get(key);
    if (ctx) {
      ctx.revert();
      ctx.kill();
      this.contexts.delete(key);
    }
  }

  cleanupAll() {
    this.contexts.forEach((ctx) => {
      ctx.revert();
      ctx.kill();
    });
    this.contexts.clear();
  }
}

const animationManager = AnimationManager.getInstance();

// Оптимизированные хуки для анимаций
export const useGsapAnimation = (
  animationKey: string,
  animationFn: (ctx: gsap.Context, element: Element) => void,
  deps: any[] = []
) => {
  const elementRef = useRef<HTMLElement>(null);

  const animate = useCallback(() => {
    if (!elementRef.current) return;

    const ctx = animationManager.getOrCreateContext(
      `${animationKey}-${elementRef.current.id || 'default'}`,
      elementRef.current
    );

    ctx.clear();
    animationFn(ctx, elementRef.current);
  }, [animationKey, animationFn, ...deps]);

  useLayoutEffect(() => {
    animate();

    return () => {
      if (elementRef.current) {
        const key = `${animationKey}-${elementRef.current.id || 'default'}`;
        animationManager.cleanupContext(key);
      }
    };
  }, [animate]);

  return { ref: elementRef, animate };
};

// Предустановленные анимации с performance оптимизацией
export const useFadeIn = (options: { duration?: number; delay?: number; stagger?: number } = {}) => {
  const { duration = 0.6, delay = 0, stagger = 0.1 } = options;

  return useGsapAnimation(
    'fade-in',
    (ctx, element) => {
      const targets = element.querySelectorAll('[data-animate="fade-in"]');
      
      ctx.add(() => {
        gsap.set(targets, { opacity: 0, y: 20, willChange: 'transform, opacity' });
        
        gsap.to(targets, {
          opacity: 1,
          y: 0,
          duration,
          delay,
          stagger,
          ease: 'power2.out',
          onComplete: () => {
            // Убираем willChange после анимации для performance
            gsap.set(targets, { willChange: 'auto' });
          }
        });
      });
    },
    [duration, delay, stagger]
  );
};

export const useSlideIn = (direction: 'left' | 'right' | 'up' | 'down' = 'up') => {
  return useGsapAnimation(
    `slide-${direction}`,
    (ctx, element) => {
      const targets = element.querySelectorAll(`[data-animate="slide-${direction}"]`);
      
      const transforms = {
        left: { x: -50, y: 0 },
        right: { x: 50, y: 0 },
        up: { x: 0, y: 50 },
        down: { x: 0, y: -50 }
      };

      const { x, y } = transforms[direction];

      ctx.add(() => {
        gsap.fromTo(targets, 
          { 
            opacity: 0, 
            x, 
            y, 
            willChange: 'transform, opacity' 
          },
          {
            opacity: 1,
            x: 0,
            y: 0,
            duration: 0.8,
            ease: 'power3.out',
            stagger: 0.1,
            onComplete: () => {
              gsap.set(targets, { willChange: 'auto' });
            }
          }
        );
      });
    },
    [direction]
  );
};

export const useScaleIn = (options: { duration?: number; delay?: number } = {}) => {
  const { duration = 0.5, delay = 0 } = options;

  return useGsapAnimation(
    'scale-in',
    (ctx, element) => {
      const targets = element.querySelectorAll('[data-animate="scale-in"]');
      
      ctx.add(() => {
        gsap.fromTo(targets,
          { scale: 0, opacity: 0, willChange: 'transform, opacity' },
          {
            scale: 1,
            opacity: 1,
            duration,
            delay,
            ease: 'back.out(1.7)',
            stagger: 0.1,
            onComplete: () => {
              gsap.set(targets, { willChange: 'auto' });
            }
          }
        );
      });
    },
    [duration, delay]
  );
};

// Hook для cleanup всех анимаций при unmount приложения
export const useGsapCleanup = () => {
  useLayoutEffect(() => {
    return () => {
      animationManager.cleanupAll();
    };
  }, []);
};
