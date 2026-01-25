import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface CurriculumSelectorProps {
  selectedCurriculum: string | null;
  onSelect: (curriculum: string) => void;
  childName?: string;
}

const curriculumOptions = [
  {
    id: "us-common-core",
    icon: "🇺🇸",
    title: "American Curriculum",
    subtitle: "Common Core & NGSS",
    description: "Used in the US and many international schools",
  },
  {
    id: "uk-ks2-ks3",
    icon: "🇬🇧",
    title: "British Curriculum",
    subtitle: "Key Stage 2 & 3",
    description: "Used in the UK and many international schools",
  },
];

export default function CurriculumSelector({
  selectedCurriculum,
  onSelect,
  childName = "your child",
}: CurriculumSelectorProps) {
  return (
    <div className="space-y-4">
      {curriculumOptions.map((option) => (
        <Card
          key={option.id}
          onClick={() => onSelect(option.id)}
          className={cn(
            "p-5 cursor-pointer transition-all duration-200 border-2",
            selectedCurriculum === option.id
              ? "border-orange-500 bg-orange-50 shadow-md"
              : "border-gray-200 hover:border-orange-300 hover:shadow-sm"
          )}
        >
          <div className="flex items-start gap-4">
            <div className="text-4xl">{option.icon}</div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-gray-800">{option.title}</h3>
              <p className="text-sm font-medium text-orange-600">{option.subtitle}</p>
              <p className="text-sm text-gray-600 mt-1">{option.description}</p>
            </div>
            {selectedCurriculum === option.id && (
              <div className="flex-shrink-0">
                <div className="w-6 h-6 rounded-full bg-orange-500 flex items-center justify-center">
                  <svg
                    className="w-4 h-4 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={3}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
              </div>
            )}
          </div>
        </Card>
      ))}

      <p className="text-center text-sm text-gray-500 mt-4">
        💡 We'll show lessons that match what {childName} learns at school!
      </p>
      <p className="text-center text-xs text-gray-400">
        Don't worry, you can change this later in settings
      </p>
    </div>
  );
}
