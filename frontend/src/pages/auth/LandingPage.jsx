import Hero from '../../components/landing/Hero.jsx';
import Features from '../../components/landing/Features.jsx';
import HowItWorks from '../../components/landing/HowItWorks.jsx';
import CTASection from '../../components/landing/CTASection.jsx';
import LandingFooter from '../../components/landing/LandingFooter.jsx';

/**
 * 비인증 사용자가 보게 되는 메인 랜딩 페이지.
 * 각 섹션은 별도 컴포넌트로 분리되어 있어 마케팅 카피 변경/실험이 쉽다.
 *
 * AppLayout(Header/Footer) 을 거치지 않고 직접 렌더된다 — 마케팅 페이지에는
 * 앱 내부 네비게이션이 필요 없으므로, 같은 헤더를 깔지 않는다.
 */
export default function LandingPage() {
  return (
    <>
      <Hero />
      <Features />
      <HowItWorks />
      <CTASection />
      <LandingFooter />
    </>
  );
}
