import { ProfileSettings } from "@/components/dashboard/profile/complete-profile";

export default function Profile() {
  const isUserProfileComplete = false;
  return (
    <main className="sm:px-4 pt-4 pb-11 flex flex-col min-h-full">
      {!isUserProfileComplete && <ProfileSettings />}
    </main>
  );
}
