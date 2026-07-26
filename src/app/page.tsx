import Link from "next/link";
import {
  LayoutDashboard,
  Users,
  Zap,
  Shield,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";

const features = [
  {
    icon: LayoutDashboard,
    title: "Drag & Drop Boards",
    description:
      "Organize tasks with intuitive drag-and-drop. Move cards between columns and reorder with ease.",
  },
  {
    icon: Users,
    title: "Team Collaboration",
    description:
      "Assign team members, track progress, and keep everyone aligned on project goals.",
  },
  {
    icon: Zap,
    title: "Real-time Sync",
    description:
      "Changes reflect instantly across all connected devices. No more refresh wars.",
  },
  {
    icon: Shield,
    title: "Secure by Default",
    description:
      "Built-in authentication and role-based access control powered by Supabase.",
  },
];

const steps = [
  "Create a board for your project",
  "Add columns to match your workflow",
  "Drag cards to track progress",
  "Assign members and set priorities",
];

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Navbar */}
      <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <div className="flex items-center gap-2">
            <LayoutDashboard className="h-6 w-6" />
            <span className="text-lg font-bold">Kanban</span>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="rounded-md px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Sign in
            </Link>
            <Link
              href="/register"
              className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              Get Started
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="flex flex-col items-center px-6 py-24 text-center md:py-32">
        <span className="mb-4 inline-block rounded-full border bg-muted px-3 py-1 text-xs font-medium">
          Open Source Project Management
        </span>
        <h1 className="max-w-3xl text-4xl font-bold tracking-tight md:text-6xl">
          Ship faster with
          <br />
          <span className="text-muted-foreground">visual project boards</span>
        </h1>
        <p className="mt-6 max-w-xl text-lg text-muted-foreground">
          A simple, powerful Kanban board to organize tasks, collaborate with
          your team, and track every project from start to finish.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/register"
            className="inline-flex items-center gap-2 rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Start for free
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href="/login"
            className="inline-flex items-center gap-2 rounded-md border px-6 py-3 text-sm font-medium transition-colors hover:bg-muted"
          >
            Sign in
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="border-t bg-muted/40 px-6 py-20">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-center text-3xl font-bold md:text-4xl">
            Everything you need
          </h2>
          <p className="mx-auto mt-3 max-w-md text-center text-muted-foreground">
            Powerful features wrapped in a clean, distraction-free interface.
          </p>
          <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((f) => (
              <div key={f.title} className="rounded-lg border bg-card p-6 shadow-sm">
                <f.icon className="mb-3 h-8 w-8 text-muted-foreground" />
                <h3 className="text-lg font-semibold">{f.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {f.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="px-6 py-20">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-center text-3xl font-bold md:text-4xl">
            Get started in seconds
          </h2>
          <p className="mx-auto mt-3 max-w-md text-center text-muted-foreground">
            Four simple steps to total project clarity.
          </p>
          <div className="mt-14 space-y-6">
            {steps.map((step, i) => (
              <div
                key={step}
                className="flex items-center gap-4 rounded-lg border bg-card p-5 shadow-sm"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                  {i + 1}
                </div>
                <div>
                  <p className="font-medium">{step}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t bg-muted/40 px-6 py-20">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold md:text-4xl">
            Ready to organize your work?
          </h2>
          <p className="mt-3 text-muted-foreground">
            Free to use. No credit card required. Set up your first board in
            under a minute.
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <Link
              href="/register"
              className="inline-flex items-center gap-2 rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              Create your board
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <CheckCircle2 className="h-4 w-4" /> Real-time sync
            </span>
            <span className="flex items-center gap-1">
              <CheckCircle2 className="h-4 w-4" /> Free forever
            </span>
            <span className="flex items-center gap-1">
              <CheckCircle2 className="h-4 w-4" /> Open source
            </span>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t px-6 py-8">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 text-sm text-muted-foreground sm:flex-row">
          <div className="flex items-center gap-2">
            <LayoutDashboard className="h-4 w-4" />
            <span className="font-medium">Kanban Board</span>
          </div>
          <p>Built with Next.js, Supabase &amp; Tailwind CSS.</p>
        </div>
      </footer>
    </div>
  );
}
