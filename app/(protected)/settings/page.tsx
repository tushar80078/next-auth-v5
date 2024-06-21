import { auth, signOut } from "@/auth";

const Settings = async () => {
  const session = await auth();

  return (
    <div>
      Settings
      {JSON.stringify(session)}
      <form
        action={async () => {
          "use server";
          await signOut();
        }}
      >
        <button type="submit">Signout</button>
      </form>
    </div>
  );
};

export default Settings;
