import type { SVGAttributes } from 'react';

export default function AppLogoIcon(props: SVGAttributes<SVGElement>) {
    return <img src="/images/fav-logo.png" alt="App Logo" {...(props as any)} />;
}

