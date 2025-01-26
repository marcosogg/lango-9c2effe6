import { Loader2 } from "lucide-react";

interface QuizBannerProps {
  bannerUrl?: string | null;
}

export const QuizBanner = ({ bannerUrl }: QuizBannerProps) => {
  return (
    <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-gray-100">
      {bannerUrl ? (
        <img
          src={bannerUrl}
          alt="Quiz banner"
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="flex items-center justify-center h-full">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      )}
    </div>
  );
};