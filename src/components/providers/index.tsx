import { ThemeProvider } from './theme';

export default function Page({ children }: React.PropsWithChildren) {
  return <ThemeProvider>{children}</ThemeProvider>;
}
