declare module 'lucide-react' {
  import { ComponentType, SVGProps } from 'react';
  
  export interface LucideProps extends SVGProps<SVGSVGElement> {
    size?: number | string;
    color?: string;
    strokeWidth?: number | string;
  }

  export const Menu: ComponentType<LucideProps>;
  export const X: ComponentType<LucideProps>;
  export const Phone: ComponentType<LucideProps>;
  export const Calendar: ComponentType<LucideProps>;
  export const User: ComponentType<LucideProps>;
  export const Home: ComponentType<LucideProps>;
  export const Info: ComponentType<LucideProps>;
  export const Mail: ComponentType<LucideProps>;
  export const Clock: ComponentType<LucideProps>;
} 