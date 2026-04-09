import { Composition } from "remotion";
import { AdmissionsVideo } from "./AdmissionsVideo";

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="KolteWorldSchoolAdmissions"
      component={AdmissionsVideo}
      durationInFrames={660}
      fps={30}
      width={1080}
      height={1920}
    />
  );
};
