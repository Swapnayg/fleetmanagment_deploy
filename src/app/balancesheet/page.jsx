import Breadcrumb from "@/components/Breadcrumb";
import FormBalanceSheet from "@/components/FormBalanceSheet";
import MasterLayout from "@/masterLayout/MasterLayout";

export const metadata = {
  title: "Balance Sheet",
  description:
    "Balance Sheet",
};

const Page = () => {
  return (
    <>
      {/* MasterLayout */}
      <MasterLayout>
        {/* Breadcrumb */}
        <Breadcrumb title='Form Validation' />

        {/* FormValidationLayer */}
        <FormBalanceSheet />
      </MasterLayout>
    </>
  );
};

export default Page;
