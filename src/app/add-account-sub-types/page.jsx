import FormAccountSubTypes from "@/components/FormAccountSubTypes";
import Breadcrumb from "@/components/Breadcrumb";
import MasterLayout from "@/masterLayout/MasterLayout";

export const metadata = {
  title: "Account Sub Types",
  description:
    "Account Sub Types.",
};

const Page = () => {
  return (
    <>
      {/* MasterLayout */}
      <MasterLayout>
        {/* Breadcrumb */}
        <Breadcrumb title='Blog Details' />

        {/* AddBlogLayer */}
        <FormAccountSubTypes />
      </MasterLayout>
    </>
  );
};

export default Page;
