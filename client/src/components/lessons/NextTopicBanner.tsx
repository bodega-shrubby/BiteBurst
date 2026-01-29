interface NextTopicBannerProps {
  topicName: string;
}

export default function NextTopicBanner({ topicName }: NextTopicBannerProps) {
  return (
    <div className="w-full border-t border-gray-200 bg-white py-6 mt-8">
      <div className="text-center">
        <div className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-1">
          Up Next
        </div>
        <h3 className="text-xl font-bold text-gray-900">
          {topicName}
        </h3>
      </div>
    </div>
  );
}
