import Breadcrumb from "@/components/Breadcrumb";
import FormBankStatement from "@/components/FormBankStatement";
import MasterLayout from "@/masterLayout/MasterLayout";

export const metadata = {
  title: "Bank Statement",
  description:
    "Bank Statement",
};

const Page = () => {
  return (
    <>
      {/* MasterLayout */}
      <MasterLayout>
        {/* Breadcrumb */}
        <Breadcrumb title='Form Validation' />

        {/* FormValidationLayer */}
        <FormBankStatement />
      </MasterLayout>
    </>
  );
};

export default Page;
