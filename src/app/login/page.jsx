import SignInLayer from "@/components/SignInLayer";
import Breadcrumb from "@/components/Breadcrumb";
import MasterLayout from "@/masterLayout/MasterLayout";

export const metadata = {
  title: "Login",
  description:
    "Login.",
};

const Page = () => {
  return (
    <>
        <SignInLayer />
    </>
  );
};

export default Page;
