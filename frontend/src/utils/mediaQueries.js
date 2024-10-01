import { useMediaQuery } from 'react-responsive'

export const breakpoints = {
  mobile: '(max-width: 600px)',
  desktop: '(min-width: 600px)',
}

export const useIsMobile = () => useMediaQuery({ query: breakpoints.mobile })
export const useIsDesktop = () => useMediaQuery({ query: breakpoints.desktop })
