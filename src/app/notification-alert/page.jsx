import Breadcrumb from "@/components/Breadcrumb";
import NotificationAlertLayer from "@/components/NotificationAlertLayer";
import MasterLayout from "@/masterLayout/MasterLayout";

export const metadata = {
  title: "Notification-Alert",
  description:
    "Notification-Alert.",
};

const Page = () => {
  return (
    <>
      {/* MasterLayout */}
      <MasterLayout>
        {/* Breadcrumb */}
        <Breadcrumb title='Settings - Notification Alert' />

        {/* NotificationAlertLayer */}
        <NotificationAlertLayer />
      </MasterLayout>
    </>
  );
};

export default Page;
