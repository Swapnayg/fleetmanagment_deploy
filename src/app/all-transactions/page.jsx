import Breadcrumb from "@/components/Breadcrumb";
import FormAllTransactions from "@/components/FormAllTransactions";
import MasterLayout from "@/masterLayout/MasterLayout";

export const metadata = {
  title: "All Transactions",
  description:
    "All Transactions",
};

const Page = () => {
  return (
    <>
      {/* MasterLayout */}
      <MasterLayout>
        {/* Breadcrumb */}
        <Breadcrumb title='Form Validation' />

        {/* FormValidationLayer */}
        <FormAllTransactions />
      </MasterLayout>
    </>
  );
};

export default Page;
