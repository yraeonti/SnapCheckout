"use client";
import { ProfileSettings } from "@/components/dashboard/profile/complete-profile";
import { ProfileDetails } from "@/components/dashboard/profile/profile-details";

import { Skeleton } from "@/components/ui/skeleton";
import { useProfileCompletion } from "@/hooks/use-profile-check";

export default function Profile() {
  const { isProfileComplete, isLoading, profileData } = useProfileCompletion();

  if (isLoading) {
    return (
      <div className="space-y-4 p-4">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
      </div>
    );
  }

  return (
    <main className="sm:px-4 pt-4 pb-11 flex flex-col min-h-full">
      {!isProfileComplete && (
        <ProfileSettings initialData={profileData ?? {}} />
      )}
      {isProfileComplete && <ProfileDetails initialData={profileData ?? {}} />}
    </main>
  );
}
