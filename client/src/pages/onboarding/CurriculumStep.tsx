import { useLocation } from "wouter";
import OnboardingLayout from "./OnboardingLayout";
import CurriculumSelector from "@/components/CurriculumSelector";
import { useOnboardingContext } from "./OnboardingContext";
import { Button } from "@/components/ui/button";

export default function CurriculumStep() {
  const [, setLocation] = useLocation();
  const { profile, updateProfile } = useOnboardingContext();

  const handleCurriculumSelect = (curriculum: string) => {
    updateProfile({ curriculum });
  };

  const handleContinue = () => {
    if (profile.curriculum) {
      setLocation("/profile/goal");
    }
  };

  return (
    <OnboardingLayout step={5} totalSteps={11}>
      <div className="space-y-6">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">
            Which curriculum does {profile.displayName || "your child"} follow in school?
          </h1>
        </div>

        <CurriculumSelector
          selectedCurriculum={profile.curriculum}
          onSelect={handleCurriculumSelect}
          childName={profile.displayName || "your child"}
        />

        <div className="pt-4">
          <Button
            onClick={handleContinue}
            disabled={!profile.curriculum}
            className="w-full bg-[#FF6A00] hover:bg-[#E55A00] text-white h-12 text-base font-bold uppercase tracking-wider disabled:opacity-50"
            style={{ borderRadius: "13px" }}
          >
            Next
          </Button>
        </div>
      </div>
    </OnboardingLayout>
  );
}
