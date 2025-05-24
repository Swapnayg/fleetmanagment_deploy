import FormCitySetup from "@/components/FormCitySetup";
import Breadcrumb from "@/components/Breadcrumb";
import MasterLayout from "@/masterLayout/MasterLayout";

export const metadata = {
  title: "City Setup",
  description:
    "City Setup.",
};

const Page = () => {
  return (
    <>
      {/* MasterLayout */}
      <MasterLayout>
        {/* Breadcrumb */}
        <Breadcrumb title='Blog Details' />

        {/* AddBlogLayer */}
        <FormCitySetup />
      </MasterLayout>
    </>
  );
};

export default Page;
