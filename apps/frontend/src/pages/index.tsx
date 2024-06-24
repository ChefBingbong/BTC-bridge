import type { NextPage } from "next";
import { Layout } from "../layouts";
import SwapModal from "~/components/SwapModal/SwapModal";

const HomePage: NextPage = () => {
  return (
    <Layout>
      <SwapModal />
    </Layout>
  );
};

export default HomePage;
