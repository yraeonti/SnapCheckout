// AccountInformation.tsx
import { FormModal } from "@/components/modals/form-modal";
import { Button } from "@/components/ui/button";
import {
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { IAccountDetails } from "@/types/profile.dto";
import { Building2 } from "lucide-react";
import BankInformation from "../complete-profile/bank-information";
import { useState } from "react";

interface AccountInformationProps {
  accountDetails?: IAccountDetails | null;
}

export const AccountInformation = ({
  accountDetails,
}: AccountInformationProps) => {
  const [openEdit, setOpenEdit] = useState(false);
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
      <CardFooter>
        <Button onClick={() => setOpenEdit(true)}>Edit Details</Button>
      </CardFooter>

      <FormModal
        title="Edit Bank Information"
        openModal={openEdit}
        setOpenModal={() => setOpenEdit(false)}
      >
        <BankInformation
          bankInformation={accountDetails ?? {}}
          closeModal={() => setOpenEdit(false)}
        />
      </FormModal>
    </div>
  );
};
