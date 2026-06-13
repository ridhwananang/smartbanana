import { Head } from '@inertiajs/react';
import GuestLayout from '../layouts/GuestLayout';
import { PageProps } from '../types/index';
import HeroSection from '@/components/welcome/HeroSection';
import WorkingSteps from '@/components/welcome/WorkingSteps';
import NutritionInsight from '@/components/welcome/NutritionInsight';
import PromoFeatures from '@/components/welcome/PromoFeatures';
import FaqAccordion from '@/components/welcome/FaqAccordion';
import CtaBanner from '@/components/welcome/CtaBanner';

export default function Welcome({
    auth,
    laravelVersion,
    phpVersion,
    onNavigate,
    onLogout,
}: PageProps & { onNavigate?: (page: string) => void; onLogout?: () => void }) {

    // Smooth scroll helper
    const handleScrollToSection = (id: string) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    return (
        <GuestLayout
            user={auth?.user}
            laravelVersion={laravelVersion}
            phpVersion={phpVersion}
            onScrollToSection={handleScrollToSection}
            onNavigate={onNavigate}
            onLogout={onLogout}
        >
            <Head title="Pindai Kematangan & Nutrisi Pisang Instan - SmartBanana" />

            <HeroSection handleScrollToSection={handleScrollToSection} />

            <WorkingSteps />

            <NutritionInsight />

            <PromoFeatures />

            <FaqAccordion />

            <CtaBanner handleScrollToSection={handleScrollToSection} />
        </GuestLayout>
    );
}
