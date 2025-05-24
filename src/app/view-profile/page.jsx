import ViewProfileLayer from "@/components/ViewProfileLayer";
import Breadcrumb from "@/components/Breadcrumb";
import MasterLayout from "@/masterLayout/MasterLayout";

export const metadata = {
  title: "View Profile",
  description:
    "View Profile.",
};

const Page = () => {
  return (
    <>
      {/* MasterLayout */}
      <MasterLayout>
        {/* Breadcrumb */}
        <Breadcrumb title='Blog Details' />

        {/* AddBlogLayer */}
        <ViewProfileLayer />
      </MasterLayout>
    </>
  );
};

export default Page;
