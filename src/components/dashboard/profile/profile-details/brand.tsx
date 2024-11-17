import { FormModal } from "@/components/modals/form-modal";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { IBrandDetails } from "@/types/profile.dto";
import { Building2, ExternalLink } from "lucide-react";
import { useState } from "react";
import Brand from "../complete-profile/brand";
import TruncatedTextCell from "@/components/truncated-text";

interface BrandDetailsProps {
  brandDetails?: IBrandDetails | null;
  clientLink?: string | null;
}

export const BrandDetails = ({
  brandDetails,
  clientLink,
}: BrandDetailsProps) => {
  const [openEdit, setOpenEdit] = useState(false);
  return (
    <div>
      <CardHeader>
        <CardTitle className="text-xl font-semibold flex items-center gap-2">
          <Building2 className="h-5 w-5" />
          Brand Details
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {brandDetails?.brand_logo && (
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 rounded-full overflow-hidden">
                <img
                  src={brandDetails.brand_logo}
                  alt="Brand Logo"
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
          )}
          <div>
            <Label>Brand Name</Label>
            <p className="text-lg font-medium">
              {brandDetails?.brand_name || "Not set"}
            </p>
          </div>
          {clientLink && (
            <div>
              <Label className="flex items-center gap-2">
                Client Link <ExternalLink className="h-4 w-4" />
              </Label>
              <TruncatedTextCell text={clientLink} route="/client" />
            </div>
          )}
        </div>
      </CardContent>

      <CardFooter>
        <Button onClick={() => setOpenEdit(true)}>Edit Details</Button>
      </CardFooter>

      <FormModal
        title="Edit Brand Information"
        openModal={openEdit}
        setOpenModal={() => setOpenEdit(false)}
      >
        <Brand
          brandDetails={brandDetails ?? {}}
          closeModal={() => setOpenEdit(false)}
        />
      </FormModal>
    </div>
  );
};
