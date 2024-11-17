import { useGetProfile } from "@/hooks/mutations/profile-mutation";
import { IProfileSettings } from "@/types/profile.dto";

interface UseProfileCompletionReturn {
  isProfileComplete: boolean;
  isLoading: boolean;
  profileData: IProfileSettings | null;
  missingFields: string[];
}

export const useProfileCompletion = (): UseProfileCompletionReturn => {
  const { data: profileData, isLoading } = useGetProfile();

  const checkProfileCompletion = (
    profile: IProfileSettings | null
  ): { isComplete: boolean; missingFields: string[] } => {
    const missingFields: string[] = [];

    if (!profile) {
      return { isComplete: false, missingFields: ["Profile Data"] };
    }

    // Check brand details
    if (!profile.brand_details) {
      missingFields.push("Brand Details");
    } else {
      if (!profile.brand_details.brand_logo) {
        missingFields.push("Brand Logo");
      }
      if (!profile.brand_details.brand_name) {
        missingFields.push("Brand Name");
      }
    }

    // Check social links
    if (!profile.social_links) {
      missingFields.push("Social Links");
    }

    // Check client link
    if (!profile.client_link) {
      missingFields.push("Client Link");
    }

    return {
      isComplete: missingFields.length === 0,
      missingFields,
    };
  };

  const { isComplete, missingFields } = checkProfileCompletion(
    profileData ?? {}
  );

  return {
    isProfileComplete: isComplete,
    isLoading,
    profileData: profileData || null,
    missingFields,
  };
};
