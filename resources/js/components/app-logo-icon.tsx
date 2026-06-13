import type { SVGAttributes } from 'react';

export default function AppLogoIcon(props: SVGAttributes<SVGElement>) {
    return <img src="/images/banana.png" alt="App Logo" {...(props as any)} />;
}
