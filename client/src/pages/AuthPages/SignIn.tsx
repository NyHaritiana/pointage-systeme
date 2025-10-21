import PageMeta from "../../components/common/PageMeta";
import AuthLayout from "./AuthPageLayout";
import SignInForm from "../../components/auth/SignInForm";

export default function SignIn() {
  return (
    <>
      <PageMeta
        title="Se connecter | FMBM"
        description="Connecté si vous avez déja un compte"
      />
      <AuthLayout>
        <SignInForm />
      </AuthLayout>
    </>
  );
}
