export default function Footer() {
  return (
    <div className="flex justify-center items-center p-2 border-t border-zinc-200">
      <p className="text-sm text-muted-foreground">
        arblog // made by{" "}
        <a
          href="https://github.com/asrvd"
          className="underline"
          target="_blank"
        >
          asrvd
        </a>
      </p>
    </div>
  );
}
