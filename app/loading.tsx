import GlobalLoader from "@/components/shared/global-loader";

export default function Loading() {
  return (
    <GlobalLoader
      isLoading={true}
      message="LOADING PAGE..."
    />
  );
}