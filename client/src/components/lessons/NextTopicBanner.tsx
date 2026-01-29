interface NextTopicBannerProps {
  topicName: string;
}

export default function NextTopicBanner({ topicName }: NextTopicBannerProps) {
  return (
    <div className="w-full border-t border-gray-200 bg-white py-5 mt-4">
      <div className="text-center">
        <div className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1">
          Next Topic
        </div>
        <h3 className="text-lg font-bold text-gray-800">
          {topicName}
        </h3>
      </div>
    </div>
  );
}
