import Breadcrumb from "@/components/Breadcrumb";
import PartyGoodsLayer from "@/components/PartyGoodsLayer";
import MasterLayout from "@/masterLayout/MasterLayout";
//import PartyLedgerTemplate from "@/components/child/PartyLedgerTemplate";

export const metadata = {
  title: "Party Goods",
  description:
    "Party Goods.",
};

const Page = () => {
  return (
    <>
      {/* MasterLayout */}
      <MasterLayout>
        {/* Breadcrumb */}
        <Breadcrumb title="Wizard" />

        {/* WizardLayer */}
        <PartyGoodsLayer />
        {/* <PartyLedgerTemplate /> */}
      </MasterLayout>
    </>
  );
};

export default Page;
