import FormModeofPay from "@/components/FormModeofPay";
import Breadcrumb from "@/components/Breadcrumb";
import MasterLayout from "@/masterLayout/MasterLayout";

export const metadata = {
  title: "Mode of Payment",
  description:
    "Mode of Payment.",
};

const Page = () => {
  return (
    <>
      {/* MasterLayout */}
      <MasterLayout>
        {/* Breadcrumb */}
        <Breadcrumb title='Blog Details' />

        {/* AddBlogLayer */}
        <FormModeofPay />
      </MasterLayout>
    </>
  );
};

export default Page;
