import { VideoSection } from "./VideoSection";
import type { VideoSourceSet } from "./HeroVideo";

export function PropertyMovie({ property, sources, poster }: { property: string; sources: VideoSourceSet; poster: string }) {
  return <VideoSection title={`Le film ${property}`} sources={sources} poster={poster} />;
}

