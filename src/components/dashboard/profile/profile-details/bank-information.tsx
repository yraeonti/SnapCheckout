// AccountInformation.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { IAccountDetails } from "@/types/profile.dto";
import { Building2 } from "lucide-react";

interface AccountInformationProps {
  accountDetails?: IAccountDetails | null;
}

export const AccountInformation = ({
  accountDetails,
}: AccountInformationProps) => {
  const accountFields = [
    { label: "Account Name", value: accountDetails?.account_name },
    { label: "Account Number", value: accountDetails?.account_number },
    { label: "Bank Name", value: accountDetails?.bank_name },
  ];

  return (
    <div>
      <CardHeader>
        <CardTitle className="text-xl font-semibold flex items-center gap-2">
          <Building2 className="h-5 w-5" />
          Account Information
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {accountFields.map((field) => (
            <div key={field.label}>
              <Label>{field.label}</Label>
              <p className="text-lg font-medium">{field.value || "Not set"}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </div>
  );
};
